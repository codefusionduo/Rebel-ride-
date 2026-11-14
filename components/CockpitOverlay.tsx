'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CameraViewMode } from './3d/DrivingCanvas';
import { CarConfig } from '@/lib/cars';
import { DriverStats, DrivingMission } from '@/lib/missions';
import { HumanHindiDialogue } from '@/lib/city-builder';
import { CircularMiniMap } from './CircularMiniMap';
import { audioEngine } from '@/lib/audio';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  CloudRain,
  Trophy,
  Car,
  ChevronDown,
  ChevronUp,
  Zap,
  Lightbulb,
  Camera,
  BookOpen,
  Coins,
  MessageCircle,
} from 'lucide-react';

interface TelemetryData {
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
  trafficSignalState?: 'red' | 'yellow' | 'green' | 'none';
  trafficSignalDist?: number;
  trafficSignalSeconds?: number;
  roadName?: string;
  cityName?: string;
  isHighway?: boolean;
  speedLimitKmH?: number;
}

interface CockpitOverlayProps {
  telemetry: TelemetryData;
  selectedCar: CarConfig;
  stats: DriverStats;
  missions: DrivingMission[];
  activeMissionId?: string | null;
  ruleNotification?: {
    id: number;
    deltaCoins: number;
    message: string;
  } | null;
  humanDialogue?: HumanHindiDialogue | null;
  onTriggerHumanDialogue?: () => void;
  cameraMode: CameraViewMode;
  onCameraChange: (mode: CameraViewMode) => void;
  onControlChange: (key: string, value: any) => void;
  onIgnitionStart: () => void;
  onOpenMissions: () => void;
  onOpenGarage: () => void;
  onCycleCar?: () => void;
  onOpenHelp?: () => void;
  isRainy: boolean;
  isNight: boolean;
  onToggleRain: () => void;
  onToggleNight: () => void;
  onToggleAudio: () => boolean;
  isAudioMuted: boolean;
  controlInputs: {
    clutch: number;
    brake: number;
    accel: number;
    steering: number;
    gear: number;
    horn: boolean;
    headlights: boolean;
    highBeam: boolean;
    hazardLights: boolean;
    turnSignalLeft: boolean;
    turnSignalRight: boolean;
    wipers: boolean;
    isEngineRunning: boolean;
  };
}

const CAMERA_MODES: CameraViewMode[] = ['cockpit', 'chase', 'hood', 'orbit'];

export const CockpitOverlay: React.FC<CockpitOverlayProps> = ({
  telemetry,
  selectedCar,
  stats,
  missions,
  activeMissionId,
  ruleNotification,
  humanDialogue,
  onTriggerHumanDialogue,
  cameraMode,
  onCameraChange,
  onControlChange,
  onOpenMissions,
  onOpenGarage,
  onCycleCar,
  onOpenHelp,
  isRainy,
  isNight,
  onToggleRain,
  onToggleNight,
  onToggleAudio,
  isAudioMuted,
  controlInputs,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  const onControlChangeRef = useRef(onControlChange);
  useEffect(() => {
    onControlChangeRef.current = onControlChange;
  }, [onControlChange]);

  // Keyboard Event Listeners for driving inputs (W/S/A/D, Arrow keys, Shift, Clutch, Horn)
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};

    const shiftGearWithSound = (newGear: number) => {
      audioEngine.playGearShift(true);
      onControlChangeRef.current('gear', newGear);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (keysPressed[e.code]) return;
      keysPressed[e.code] = true;

      const onChange = onControlChangeRef.current;

      // Horn (H or Space)
      if (e.code === 'KeyH' || e.code === 'Space') {
        onChange('horn', true);
      }

      // Clutch (Shift or KeyC)
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyC') {
        onChange('clutch', 1.0);
      }

      // Gear Shifting Shortcuts
      if (e.code === 'KeyR') shiftGearWithSound(-1);
      if (e.code === 'KeyN' || e.code === 'Digit0') shiftGearWithSound(0);
      if (stats.transmissionMode === 'manual') {
        if (e.code === 'Digit1') shiftGearWithSound(1);
        if (e.code === 'Digit2') shiftGearWithSound(2);
        if (e.code === 'Digit3') shiftGearWithSound(3);
        if (e.code === 'Digit4') shiftGearWithSound(4);
        if (e.code === 'Digit5') shiftGearWithSound(5);
        if (e.code === 'Digit6' && selectedCar.maxGears >= 6) shiftGearWithSound(6);
      } else {
        if (e.code === 'Digit1' || e.code === 'KeyD') shiftGearWithSound(1);
      }

      // Throttle (W or Up Arrow)
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        onChange('accel', 1.0);
      }

      // Brake (S or Down Arrow)
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        onChange('brake', 1.0);
      }

      // Steering (A/D or Left/Right Arrow)
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        onChange('steering', -1.0);
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        onChange('steering', 1.0);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.code] = false;
      const onChange = onControlChangeRef.current;

      if (e.code === 'KeyH' || e.code === 'Space') {
        onChange('horn', false);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyC') {
        onChange('clutch', 0.0);
      }
      if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        onChange('accel', 0.0);
      }
      if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        onChange('brake', 0.0);
      }
      if (
        (e.code === 'KeyA' || e.code === 'ArrowLeft') &&
        !keysPressed['KeyD'] &&
        !keysPressed['ArrowRight']
      ) {
        onChange('steering', 0.0);
      }
      if (
        (e.code === 'KeyD' || e.code === 'ArrowRight') &&
        !keysPressed['KeyA'] &&
        !keysPressed['ArrowLeft']
      ) {
        onChange('steering', 0.0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [stats.transmissionMode, selectedCar.maxGears]);

  const getGearLabel = (g: number) => {
    if (g === -1) return 'R';
    if (g === 0) return 'N';
    return `${g}`;
  };

  // Compute 2D coordinates (x%, y%) for the physical H-Pattern Gear Knob inside the Shifter Box
  const getShifterKnobPosition = (gear: number): { left: string; top: string } => {
    switch (gear) {
      case 1:
        return { left: '18%', top: '22%' };
      case 2:
        return { left: '18%', top: '78%' };
      case 3:
        return { left: '42%', top: '22%' };
      case 4:
        return { left: '42%', top: '78%' };
      case 5:
        return { left: '66%', top: '22%' };
      case 6:
      case 7:
      case 8:
        return { left: '66%', top: '78%' };
      case -1: // Reverse (Far right bottom)
        return { left: '86%', top: '78%' };
      case 0: // Neutral (Center horizontal bar)
      default:
        return { left: '42%', top: '50%' };
    }
  };

  const handleSelectGear = (g: number) => {
    audioEngine.playGearShift(true);
    onControlChange('gear', g);
  };

  const handleCycleCamera = () => {
    const currentIndex = CAMERA_MODES.indexOf(cameraMode);
    const nextMode = CAMERA_MODES[(currentIndex + 1) % CAMERA_MODES.length];
    onCameraChange(nextMode);
  };

  // Helper for interactive vertical drag/press on a realistic foot pedal
  const handlePedalPointer = (
    pedalKey: 'clutch' | 'brake' | 'accel',
    e: React.PointerEvent<HTMLDivElement>,
    isDownOrMove: boolean
  ) => {
    if (!isDownOrMove) {
      onControlChange(pedalKey, 0);
      return;
    }
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const val = Math.round(Math.max(0.2, Math.min(1, relY * 1.15)) * 20) / 20;
    onControlChange(pedalKey, val);
  };

  // Helper for interactive drag/turn on the realistic Car Steering Wheel ("Handle")
  const handleWheelPointer = (
    e: React.PointerEvent<HTMLDivElement>,
    isActive: boolean
  ) => {
    if (!isActive) {
      onControlChange('steering', 0);
      return;
    }
    if (e.buttons !== 1 && e.pointerType === 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const dx = e.clientX - centerX;
    const normalized = Math.max(-1, Math.min(1, dx / (rect.width * 0.42)));
    onControlChange('steering', Math.round(normalized * 20) / 20);
  };

  const knobPos = getShifterKnobPosition(telemetry.gear);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1.5 xl:p-4 z-20 overflow-hidden">
      {/* TOP SECTION: Navigation Bar + Compact HUD Gauges */}
      <div className="flex flex-col gap-1.5 xl:gap-3 w-full max-w-7xl mx-auto shrink-0">
        {/* 1. Top Bar Navigation & Info Banner */}
        <div className="flex items-center justify-between gap-1.5 xl:gap-4 w-full pointer-events-auto">
          <div
            role="button"
            tabIndex={0}
            onClick={onCycleCar || onOpenGarage}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                (onCycleCar || onOpenGarage)();
              }
            }}
            title="Click to Change Car"
            className="flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800/95 active:scale-95 backdrop-blur-md px-2.5 py-1 xl:px-4 xl:py-2 rounded-xl border border-blue-500/40 hover:border-blue-400 shadow-xl min-w-0 cursor-pointer transition-all group"
          >
            <Car className="w-4 h-4 xl:w-5 xl:h-5 text-blue-400 group-hover:text-blue-300 shrink-0 transition-transform group-hover:scale-110" />
            <div className="truncate">
              <h1 className="text-[11px] xl:text-sm font-bold text-slate-100 group-hover:text-blue-200 leading-none truncate">
                {selectedCar.name}
              </h1>
              <p className="text-[9px] xl:text-xs text-blue-400/90 mt-0.5 truncate font-medium">
                Lv.{stats.level} · {stats.transmissionMode === 'manual' ? 'Manual' : 'Auto'} · Change Car ↻
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 xl:gap-2 shrink-0">
            {/* Live Rule Coins Counter Badge */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 xl:px-3 xl:py-2 rounded-xl border text-[10px] xl:text-xs font-black shadow-lg transition-all ${
                stats.coins >= 0
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                  : 'bg-red-500/25 border-red-400/60 text-red-300'
              }`}
              title="Traffic Rule Coins (+1/+2 for obeying rules, minus for breaking rules)"
            >
              <Coins className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-400 shrink-0" />
              <span>{stats.coins} Coins</span>
            </div>

            <button
              onClick={onOpenMissions}
              className="flex items-center gap-1 bg-slate-900/85 hover:bg-slate-800 text-amber-400 px-2 py-1 xl:px-3 xl:py-2 rounded-xl border border-amber-500/30 text-[10px] xl:text-xs font-semibold transition-all shadow-lg"
              title="Missions"
            >
              <Trophy className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              <span className="hidden sm:inline">Missions ({stats.xp} XP)</span>
            </button>

            <button
              onClick={onOpenGarage}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 xl:px-3 xl:py-2 rounded-xl text-[10px] xl:text-xs font-semibold transition-all shadow-lg shadow-blue-600/30"
            >
              <Car className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              <span>Garage</span>
            </button>

            {/* Compact Camera Switcher Button (< xl) */}
            <button
              onClick={handleCycleCamera}
              className="flex xl:hidden items-center gap-1 bg-slate-900/85 hover:bg-slate-800 text-blue-400 px-2 py-1 rounded-xl border border-slate-800 text-[10px] font-bold uppercase"
              title="Switch Camera View"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraMode === 'cockpit' ? '1st' : cameraMode}</span>
            </button>

            {/* Desktop Camera Segmented Bar (xl+) */}
            <div className="hidden xl:flex items-center p-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-800">
              {CAMERA_MODES.map((mode) => (
                <button
                  key={mode}
                  onClick={() => onCameraChange(mode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                    cameraMode === mode
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode === 'cockpit' ? '1st Person' : mode}
                </button>
              ))}
            </div>

            <button
              onClick={onToggleNight}
              className="flex items-center gap-1 px-2 py-1.5 xl:px-3 xl:py-2 bg-slate-900/85 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-800 text-[10px] xl:text-xs font-bold transition-colors"
              title="Toggle Day/Night Mode"
            >
              {isNight ? (
                <>
                  <Moon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-indigo-400" />
                  <span className="hidden sm:inline">Night</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-amber-400" />
                  <span className="hidden sm:inline">Day</span>
                </>
              )}
            </button>

            <button
              onClick={onToggleRain}
              className={`p-1.5 xl:p-2.5 bg-slate-900/85 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors ${
                isRainy ? 'text-blue-400 border-blue-500/40' : 'text-slate-400'
              }`}
              title="Toggle Rain & Wipers"
            >
              <CloudRain className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            </button>

            <button
              onClick={onToggleAudio}
              className="p-1.5 xl:p-2.5 bg-slate-900/85 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-800 transition-colors"
              title="Toggle Mute"
            >
              {isAudioMuted ? (
                <VolumeX className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-emerald-400" />
              )}
            </button>

            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="p-1.5 xl:p-2.5 bg-slate-900/85 hover:bg-slate-800 text-blue-400 rounded-xl border border-slate-800 transition-colors"
                title="Driving Guide & Traffic Rules"
              >
                <BookOpen className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 2. Sleek Floating Dashboard HUD Gauges, Live Traffic Signal & Circular Mini-Map */}
        <div className="pointer-events-auto flex items-center justify-between w-full px-0.5 gap-1.5">
          {/* Left HUD Cluster: Circular Street Grid Mini-Map + Speedometer */}
          <div className="flex items-center gap-1.5 xl:gap-3">
            <CircularMiniMap
              carX={telemetry.carX}
              carZ={telemetry.carZ}
              carHeadingRad={telemetry.carHeadingRad}
              missions={missions}
              activeMissionId={activeMissionId}
              onSelectMissionClick={onOpenMissions}
            />

            <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-1 xl:p-3.5 rounded-xl xl:rounded-2xl shadow-2xl flex items-center gap-2">
              <div className="relative w-11 h-11 xl:w-20 xl:h-20 flex items-center justify-center rounded-full border-2 xl:border-4 border-slate-800 bg-slate-950">
                <div className="text-center">
                  <span className="text-xs xl:text-2xl font-black text-slate-100 font-mono tracking-tighter tabular-nums leading-none block">
                    {Math.round(telemetry.speedKmH)}
                  </span>
                  <p className="text-[7px] xl:text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                    KM/H
                  </p>
                </div>
              </div>
              <div className="hidden xl:block">
                <div className="text-xs text-slate-400">
                  Max: {telemetry.speedLimitKmH ?? 105} KM/H
                </div>
                <div className="text-sm font-bold text-slate-200 font-mono tabular-nums">
                  {(telemetry.distanceDrivenMeters / 1000).toFixed(2)} km
                </div>
              </div>
            </div>
          </div>

          {/* Center HUD Cluster: Live Road/Highway Sign + Intersection Traffic Light Indicator + Rule Toast */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              {/* Live Green Highway / Street Road Sign Board */}
              <div
                className={`px-2.5 py-1 xl:px-3.5 xl:py-1.5 rounded-xl border-2 shadow-2xl flex items-center gap-2 transition-colors ${
                  telemetry.isHighway
                    ? 'bg-emerald-950/90 border-emerald-400/90 text-emerald-100'
                    : 'bg-teal-950/90 border-slate-300/80 text-slate-100'
                }`}
              >
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[8px] xl:text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                        telemetry.isHighway
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-amber-300'
                      }`}
                    >
                      {telemetry.isHighway ? 'HIGHWAY 180 KM/H' : 'CITY RD 105 KM/H'}
                    </span>
                    <span className="text-[8px] xl:text-[10px] font-bold text-amber-300 truncate max-w-[110px] xl:max-w-none">
                      {telemetry.cityName ?? 'Capital Embassy City'}
                    </span>
                  </div>
                  <div className="text-[10px] xl:text-xs font-black tracking-wide uppercase text-white mt-0.5 truncate max-w-[175px] xl:max-w-none">
                    {telemetry.roadName ?? 'Embassy Central Ave'}
                  </div>
                </div>
              </div>

              {/* Live Intersection Traffic Signal Widget */}
              <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 px-2.5 py-1 xl:px-3.5 xl:py-1.5 rounded-xl shadow-2xl flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                  <span
                    className={`w-3 h-3 xl:w-4 xl:h-4 rounded-full transition-all ${
                      telemetry.trafficSignalState === 'red'
                        ? 'bg-red-500 shadow-[0_0_10px_#ef4444] scale-110'
                        : 'bg-red-950/60'
                    }`}
                  />
                  <span
                    className={`w-3 h-3 xl:w-4 xl:h-4 rounded-full transition-all ${
                      telemetry.trafficSignalState === 'yellow'
                        ? 'bg-amber-400 shadow-[0_0_10px_#facc15] scale-110'
                        : 'bg-amber-950/60'
                    }`}
                  />
                  <span
                    className={`w-3 h-3 xl:w-4 xl:h-4 rounded-full transition-all ${
                      telemetry.trafficSignalState !== 'red' &&
                      telemetry.trafficSignalState !== 'yellow'
                        ? 'bg-emerald-500 shadow-[0_0_10px_#22c55e] scale-110'
                        : 'bg-emerald-950/60'
                    }`}
                  />
                </div>
                <div className="text-left">
                  <div className="text-[9px] xl:text-[11px] font-black uppercase tracking-wider leading-none text-slate-200">
                    Signal ({telemetry.trafficSignalSeconds ?? 8}s)
                  </div>
                  <div className="text-[8px] xl:text-[10px] font-mono text-slate-400 leading-tight">
                    {telemetry.trafficSignalDist ?? 60}m ·{' '}
                    {telemetry.trafficSignalState === 'red'
                      ? 'STOP (+2🪙)'
                      : telemetry.trafficSignalState === 'yellow'
                      ? 'SLOW'
                      : 'GO (+2🪙)'}
                  </div>
                </div>
              </div>
            </div>

            {ruleNotification && (
              <div
                key={ruleNotification.id}
                className={`px-3 py-1 rounded-xl border text-[10px] xl:text-xs font-extrabold shadow-2xl animate-bounce ${
                  ruleNotification.deltaCoins > 0
                    ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300'
                    : 'bg-red-950/95 border-red-400 text-red-300'
                }`}
              >
                {ruleNotification.message}
              </div>
            )}

            {/* Live Pedestrian Hindi Dialogue Speech Bubble */}
            {humanDialogue && (
              <div
                role="button"
                tabIndex={0}
                onClick={onTriggerHumanDialogue}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onTriggerHumanDialogue?.();
                  }
                }}
                title="Click to hear another Hindi dialogue from city pedestrians"
                className={`pointer-events-auto cursor-pointer px-3 py-1.5 rounded-2xl border-2 shadow-2xl backdrop-blur-md flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 max-w-md ${
                  humanDialogue.mood === 'angry'
                    ? 'bg-red-950/90 border-red-400 text-red-100'
                    : humanDialogue.mood === 'horn'
                      ? 'bg-amber-950/90 border-amber-400 text-amber-100'
                      : humanDialogue.mood === 'praise'
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                        : humanDialogue.mood === 'fast'
                          ? 'bg-orange-950/90 border-orange-400 text-orange-100'
                          : 'bg-slate-950/90 border-sky-400/80 text-slate-100'
                }`}
              >
                <div className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] xl:text-[10px] font-black uppercase tracking-wider text-amber-300">
                      🗣 {humanDialogue.speaker}
                    </span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-slate-800/90 text-slate-300 font-semibold">
                      Tap for next
                    </span>
                  </div>
                  <div className="text-xs xl:text-sm font-extrabold text-white leading-snug truncate">
                    {humanDialogue.hindi}
                  </div>
                  <div className="text-[9px] xl:text-[11px] font-medium text-slate-300 leading-tight truncate">
                    &ldquo;{humanDialogue.hinglish}&rdquo;
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right HUD Cluster: RPM + Current Gear Indicator & Gear Speed Ceiling */}
          {(() => {
            const g = telemetry.gear;
            const gearMaxKmH =
              g === -1
                ? 28
                : g <= 0
                  ? 0
                  : g === 1
                    ? 30
                    : g === 2
                      ? 60
                      : g === 3
                        ? 95
                        : g === 4
                          ? 135
                          : g === 5
                            ? Math.min(selectedCar.topSpeedKmH, 175)
                            : selectedCar.topSpeedKmH;
            const needsShiftUp =
              g > 0 &&
              g < selectedCar.maxGears &&
              telemetry.speedKmH >= gearMaxKmH - 2.5;

            return (
              <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-1 xl:p-3.5 rounded-xl xl:rounded-2xl shadow-2xl flex items-center gap-2">
                <div className="text-right hidden sm:block px-1">
                  <div className="text-[9px] xl:text-xs text-slate-400 leading-tight">
                    {g > 0 ? `G${g} Max: ${gearMaxKmH} km/h` : g === -1 ? 'Rev Max: 28 km/h' : 'Neutral'}
                  </div>
                  <div className="text-[11px] xl:text-sm font-bold text-blue-400 font-mono tabular-nums leading-tight">
                    {telemetry.rpm} RPM
                  </div>
                  {needsShiftUp && (
                    <div className="text-[9px] xl:text-[10px] font-black text-amber-400 animate-pulse leading-tight">
                      SHIFT UP G{g + 1} ▲
                    </div>
                  )}
                </div>
                <div
                  className={`relative w-11 h-11 xl:w-20 xl:h-20 flex items-center justify-center rounded-full border-2 xl:border-4 bg-slate-950 transition-colors ${
                    needsShiftUp
                      ? 'border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                      : 'border-blue-600/40'
                  }`}
                >
                  <div className="text-center">
                    <span
                      className={`text-sm xl:text-3xl font-black font-mono leading-none block ${
                        needsShiftUp ? 'text-amber-400' : 'text-blue-400'
                      }`}
                    >
                      {getGearLabel(telemetry.gear)}
                    </span>
                    <p className="text-[7px] xl:text-[9px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                      {needsShiftUp ? 'SHIFT ▲' : g > 0 ? `≤${gearMaxKmH}` : 'GEAR'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. BOTTOM COCKPIT DOCK: All Buttons, H-Pattern Gear Shifter, Steering Handle & 3 Pedals Fully Visible */}
      <div className="pointer-events-auto self-center w-full max-w-5xl shrink-0 mt-auto transition-all duration-300">
        <div className="flex justify-center mb-0.5">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-[10px] xl:text-xs px-3 py-0.5 rounded-t-xl flex items-center gap-1 shadow-lg transition-colors"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3 h-3" />
                <span>Show Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {!isDockCollapsed && (
          <div className="bg-slate-950/95 border border-slate-800 rounded-xl xl:rounded-2xl p-1.5 xl:p-3.5 shadow-2xl flex flex-col gap-1.5 xl:gap-2.5">
            {/* Top Utility Strip: Quick Steering Buttons + Horn + Hold Bite 50% + Lights + Manual/Auto */}
            <div className="flex items-center justify-between gap-1 xl:gap-2 border-b border-slate-800/80 pb-1 xl:pb-2 overflow-x-auto no-scrollbar">
              {/* Left: Touch/Mouse Steering & Horn */}
              <div className="flex items-center gap-1 xl:gap-1.5 shrink-0">
                <button
                  onPointerDown={() => onControlChange('steering', -1)}
                  onPointerUp={() => onControlChange('steering', 0)}
                  onPointerLeave={() => onControlChange('steering', 0)}
                  className={`px-2 py-0.5 xl:px-3 xl:py-1.5 rounded-lg text-[10px] xl:text-xs font-bold border transition-all touch-none ${
                    controlInputs.steering < -0.1
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  ◀ L
                </button>
                <button
                  onPointerDown={() => onControlChange('steering', 1)}
                  onPointerUp={() => onControlChange('steering', 0)}
                  onPointerLeave={() => onControlChange('steering', 0)}
                  className={`px-2 py-0.5 xl:px-3 xl:py-1.5 rounded-lg text-[10px] xl:text-xs font-bold border transition-all touch-none ${
                    controlInputs.steering > 0.1
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  R ▶
                </button>
                <button
                  onPointerDown={() => onControlChange('horn', true)}
                  onPointerUp={() => onControlChange('horn', false)}
                  onPointerLeave={() => onControlChange('horn', false)}
                  className={`px-2 py-0.5 xl:px-3 xl:py-1.5 rounded-lg text-[10px] xl:text-xs font-bold border flex items-center gap-1 transition-all touch-none ${
                    controlInputs.horn
                      ? 'bg-amber-500 border-amber-300 text-slate-950'
                      : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  }`}
                >
                  <Zap className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                  <span>Horn</span>
                </button>
              </div>

              {/* Right: Hold Bite 50%, Lights & Manual/Auto Mode Switch */}
              <div className="flex items-center gap-1 xl:gap-2 shrink-0">
                {stats.transmissionMode === 'manual' && (
                  <button
                    onClick={() =>
                      onControlChange('clutch', controlInputs.clutch === 0.5 ? 0 : 0.5)
                    }
                    className={`px-2 py-0.5 xl:py-1.5 rounded-lg border text-[10px] xl:text-xs font-bold transition-all ${
                      controlInputs.clutch >= 0.4 && controlInputs.clutch <= 0.6
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {controlInputs.clutch === 0.5 ? 'Bite 50% ✓' : 'Hold Bite 50%'}
                  </button>
                )}

                <button
                  onClick={() => onControlChange('headlights', !controlInputs.headlights)}
                  className={`px-2 py-0.5 xl:px-2.5 xl:py-1.5 rounded-lg border text-[10px] xl:text-xs font-bold flex items-center gap-1 transition-all ${
                    controlInputs.headlights
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 xl:w-3.5 xl:h-3.5" />
                  <span>Lights</span>
                </button>

                <button
                  onClick={() =>
                    onControlChange(
                      'transmissionMode',
                      stats.transmissionMode === 'manual' ? 'automatic' : 'manual'
                    )
                  }
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-2 py-0.5 xl:px-3 xl:py-1.5 rounded-lg text-[10px] xl:text-xs font-bold border border-blue-500/40 transition-colors"
                >
                  {stats.transmissionMode === 'manual' ? 'Manual' : 'Auto'}
                </button>
              </div>
            </div>

            {/* MAIN REALISTIC COCKPIT ROW: GEAR SHIFTER (LEFT) + STEERING HANDLE (CENTER) + FOOTWELL PEDALS (RIGHT) */}
            <div className="grid grid-cols-12 gap-1.5 xl:gap-4 items-stretch">
              {/* LEFT 4 COLUMNS: REALISTIC H-PATTERN GEAR SHIFTER BOX (ALL GEARS 1-6, N, R VISIBLE) */}
              <div className="col-span-4 bg-slate-900/90 border border-slate-800/90 rounded-xl p-1.5 xl:p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] xl:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    {stats.transmissionMode === 'manual' ? 'Gear Shifter' : 'Auto Gate'}
                  </span>
                  <span className="text-[10px] xl:text-xs font-black text-blue-400 font-mono shrink-0">
                    G: {getGearLabel(telemetry.gear)}
                  </span>
                </div>

                {stats.transmissionMode === 'manual' ? (
                  /* REALISTIC H-PATTERN SHIFTER GATE */
                  <div className="relative w-full h-20 xl:h-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-lg xl:rounded-xl border border-slate-700 xl:border-2 shadow-inner overflow-hidden select-none touch-none">
                    {/* Engraved Metallic H-Pattern Tracks (SVG) */}
                    <svg
                      viewBox="0 0 200 120"
                      className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                      <line
                        x1="36"
                        y1="60"
                        x2="172"
                        y2="60"
                        stroke="#475569"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="36"
                        y1="24"
                        x2="36"
                        y2="96"
                        stroke="#475569"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="84"
                        y1="24"
                        x2="84"
                        y2="96"
                        stroke="#475569"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="132"
                        y1="24"
                        x2="132"
                        y2="96"
                        stroke="#475569"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <line
                        x1="172"
                        y1="60"
                        x2="172"
                        y2="96"
                        stroke="#7f1d1d"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Clickable Gear Slot Buttons (1, 2, 3, 4, 5) */}
                    {[
                      { g: 1, left: '18%', top: '22%' },
                      { g: 2, left: '18%', top: '78%' },
                      { g: 3, left: '42%', top: '22%' },
                      { g: 4, left: '42%', top: '78%' },
                      { g: 5, left: '66%', top: '22%' },
                    ].map((slot) => (
                      <button
                        key={slot.g}
                        onClick={() => handleSelectGear(slot.g)}
                        style={{ left: slot.left, top: slot.top }}
                        className="-translate-x-1/2 -translate-y-1/2 absolute w-6 h-5 xl:w-9 xl:h-7 rounded bg-slate-800/95 hover:bg-blue-600/50 border border-slate-500 text-[10px] xl:text-xs font-black text-slate-100 flex items-center justify-center transition-colors z-10 shadow"
                      >
                        {slot.g}
                      </button>
                    ))}

                    {/* Gear 6 */}
                    {selectedCar.maxGears >= 6 && (
                      <button
                        onClick={() => handleSelectGear(6)}
                        style={{ left: '66%', top: '78%' }}
                        className="-translate-x-1/2 -translate-y-1/2 absolute w-6 h-5 xl:w-9 xl:h-7 rounded bg-slate-800/95 hover:bg-blue-600/50 border border-slate-500 text-[10px] xl:text-xs font-black text-slate-100 flex items-center justify-center transition-colors z-10 shadow"
                      >
                        6
                      </button>
                    )}

                    {/* Neutral (N) Slot */}
                    <button
                      onClick={() => handleSelectGear(0)}
                      style={{ left: '86%', top: '24%' }}
                      className="-translate-x-1/2 -translate-y-1/2 absolute w-6 h-5 xl:w-8 xl:h-6 rounded bg-amber-500/25 hover:bg-amber-500/45 border border-amber-400/70 text-[9px] xl:text-[10px] font-black text-amber-300 flex items-center justify-center z-10 shadow"
                    >
                      N
                    </button>

                    {/* Reverse (R) Slot */}
                    <button
                      onClick={() => handleSelectGear(-1)}
                      style={{ left: '86%', top: '78%' }}
                      className="-translate-x-1/2 -translate-y-1/2 absolute w-6 h-5 xl:w-9 xl:h-7 rounded bg-red-950/95 hover:bg-red-600/60 border border-red-500/80 text-[10px] xl:text-xs font-black text-red-300 flex items-center justify-center transition-colors z-10 shadow"
                    >
                      R
                    </button>

                    {/* REALISTIC MOVING 3D-STYLED SPHERICAL SHIFT KNOB */}
                    <div
                      style={{
                        left: knobPos.left,
                        top: knobPos.top,
                      }}
                      className="-translate-x-1/2 -translate-y-1/2 absolute z-20 pointer-events-none transition-all duration-200 ease-out flex items-center justify-center"
                    >
                      <div className="w-7 h-7 xl:w-11 xl:h-11 rounded-full bg-black/60 border border-slate-500/60 flex items-center justify-center shadow-2xl">
                        <div className="w-5 h-5 xl:w-9 xl:h-9 rounded-full bg-gradient-to-br from-slate-200 via-slate-700 to-slate-950 border-2 border-blue-400 shadow-lg flex flex-col items-center justify-center">
                          <span className="text-[9px] xl:text-xs font-black text-white drop-shadow">
                            {getGearLabel(telemetry.gear)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* AUTOMATIC PRND STEPPED SHIFTER GATE */
                  <div className="flex items-center justify-around bg-slate-950 p-1.5 xl:p-2.5 rounded-lg xl:rounded-xl border border-slate-800 h-20 xl:h-32 gap-1.5">
                    {[
                      { label: 'R', sub: 'Rev', val: -1, color: 'text-red-400' },
                      { label: 'N', sub: 'Neu', val: 0, color: 'text-amber-400' },
                      { label: 'D', sub: 'Drive', val: 1, color: 'text-emerald-400' },
                    ].map((item) => {
                      const isActive =
                        item.val === 1 ? telemetry.gear >= 1 : telemetry.gear === item.val;
                      return (
                        <button
                          key={item.label}
                          onClick={() => handleSelectGear(item.val)}
                          className={`flex flex-col items-center justify-center flex-1 h-full rounded-lg border transition-all ${
                            isActive
                              ? 'bg-blue-600/25 border-blue-400 shadow-lg scale-105'
                              : 'bg-slate-900 border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <span className={`text-sm xl:text-xl font-black ${item.color}`}>
                            {item.label}
                          </span>
                          <span className="text-[8px] xl:text-[10px] text-slate-300 font-semibold">
                            {item.sub}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CENTER 3 COLUMNS: REALISTIC INTERACTIVE CAR STEERING WHEEL ("HANDLE") */}
              <div className="col-span-3 bg-slate-900/90 border border-slate-800/90 rounded-xl p-1.5 xl:p-3 flex flex-col items-center justify-between select-none">
                <div className="flex items-center justify-between w-full mb-0.5">
                  <span className="text-[9px] xl:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    Handle
                  </span>
                  <span className="text-[9px] xl:text-xs font-bold text-blue-400 font-mono tabular-nums">
                    {telemetry.steeringAngle > 0
                      ? `+${telemetry.steeringAngle}°`
                      : telemetry.steeringAngle < 0
                      ? `${telemetry.steeringAngle}°`
                      : '0°'}
                  </span>
                </div>

                {/* Interactive Rotatable 3-Spoke Leather Steering Wheel */}
                <div
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    handleWheelPointer(e, true);
                  }}
                  onPointerMove={(e) => handleWheelPointer(e, true)}
                  onPointerUp={(e) => handleWheelPointer(e, false)}
                  onPointerCancel={(e) => handleWheelPointer(e, false)}
                  title="Drag Left/Right to steer or use A / D keys"
                  className="relative w-20 h-20 xl:w-32 xl:h-32 flex items-center justify-center cursor-grab active:cursor-grabbing my-auto touch-none"
                >
                  {/* Rotating Steering Wheel Assembly */}
                  <div
                    style={{
                      transform: `rotate(${controlInputs.steering * 135}deg)`,
                    }}
                    className="relative w-full h-full rounded-full transition-transform duration-75 ease-out flex items-center justify-center"
                  >
                    <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-2xl">
                      <defs>
                        <radialGradient id="wheel-leather" cx="50%" cy="50%" r="50%">
                          <stop offset="72%" stopColor="#0f172a" />
                          <stop offset="86%" stopColor="#334155" />
                          <stop offset="95%" stopColor="#1e293b" />
                          <stop offset="100%" stopColor="#020617" />
                        </radialGradient>
                        <linearGradient id="spoke-metal" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#cbd5e1" />
                          <stop offset="50%" stopColor="#64748b" />
                          <stop offset="100%" stopColor="#334155" />
                        </linearGradient>
                      </defs>

                      <path
                        d="M 18 74 L 62 68 L 62 92 L 18 86 Z"
                        fill="url(#spoke-metal)"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 142 74 L 98 68 L 98 92 L 142 86 Z"
                        fill="url(#spoke-metal)"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M 68 95 L 92 95 L 96 142 L 64 142 Z"
                        fill="url(#spoke-metal)"
                        stroke="#1e293b"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="75"
                        y="108"
                        width="10"
                        height="22"
                        rx="3"
                        fill="#090d16"
                      />

                      <circle
                        cx="80"
                        cy="80"
                        r="66"
                        fill="none"
                        stroke="url(#wheel-leather)"
                        strokeWidth="18"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="57"
                        fill="none"
                        stroke="#475569"
                        strokeWidth="1"
                        strokeDasharray="4 3"
                      />
                      <path
                        d="M 73 14 L 87 14"
                        stroke="#ef4444"
                        strokeWidth="18"
                        strokeLinecap="butt"
                      />
                    </svg>

                    {/* Center Horn Airbag Hub Button */}
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        onControlChange('horn', true);
                      }}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        onControlChange('horn', false);
                      }}
                      onPointerLeave={() => onControlChange('horn', false)}
                      className={`absolute w-8 h-8 xl:w-12 xl:h-12 rounded-full border xl:border-2 flex flex-col items-center justify-center shadow-inner transition-all touch-none ${
                        controlInputs.horn
                          ? 'bg-amber-500 border-amber-200 text-slate-950 scale-95 shadow-amber-500/50'
                          : 'bg-gradient-to-b from-slate-800 to-slate-950 border-slate-600 text-slate-200 hover:border-amber-400'
                      }`}
                      title="Press Center Hub for Horn (Key H)"
                    >
                      <Zap className="w-2.5 h-2.5 xl:w-3.5 xl:h-3.5 text-amber-400" />
                      <span className="text-[6px] xl:text-[8px] font-black tracking-wider uppercase">
                        HORN
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLUMNS: THREE REALISTIC PHYSICAL CAR PEDALS (CLUTCH, BRAKE, GAS) */}
              <div className="col-span-5 bg-slate-900/90 border border-slate-800/90 rounded-xl p-1.5 xl:p-3 flex flex-col justify-between shadow-inner">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] xl:text-[11px] font-bold uppercase tracking-wider text-slate-400 truncate">
                    Pedals (Clutch · Brake · Gas)
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] xl:text-[10px] font-mono font-bold">
                    <span className="text-blue-400">C:{Math.round(controlInputs.clutch * 100)}%</span>
                    <span className="text-red-400">B:{Math.round(controlInputs.brake * 100)}%</span>
                    <span className="text-emerald-400">G:{Math.round(controlInputs.accel * 100)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 xl:gap-4 items-end">
                  {/* 1. REAL CLUTCH PEDAL (LEFT) */}
                  <div
                    className={`flex items-center justify-center gap-1 xl:gap-2 select-none ${
                      stats.transmissionMode === 'automatic' ? 'opacity-35 pointer-events-none' : ''
                    }`}
                  >
                    <div className="w-1.5 xl:w-2.5 h-16 xl:h-24 bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden flex flex-col justify-end shrink-0">
                      <div
                        className="absolute left-0 right-0 bottom-[40%] h-[20%] bg-emerald-500/35 border-y border-emerald-400/60 z-10"
                        title="Bite Point Zone"
                      />
                      <div
                        className="w-full bg-blue-500 transition-all duration-75"
                        style={{ height: `${Math.round(controlInputs.clutch * 100)}%` }}
                      />
                    </div>

                    <div
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        handlePedalPointer('clutch', e, true);
                      }}
                      onPointerMove={(e) => handlePedalPointer('clutch', e, true)}
                      onPointerUp={() => onControlChange('clutch', 0)}
                      onPointerCancel={() => onControlChange('clutch', 0)}
                      className="relative flex flex-col items-center cursor-pointer group touch-none"
                    >
                      <div className="w-2 h-2 xl:h-4 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-t" />
                      <div
                        style={{
                          transform: `perspective(220px) rotateX(${
                            controlInputs.clutch * 26
                          }deg) translateY(${controlInputs.clutch * 4}px)`,
                        }}
                        className={`w-11 sm:w-14 xl:w-20 h-16 xl:h-24 rounded-lg xl:rounded-xl border xl:border-2 transition-transform duration-75 flex flex-col justify-between p-1 xl:p-2 shadow-xl ${
                          controlInputs.clutch > 0.05
                            ? 'bg-gradient-to-b from-blue-500 via-slate-300 to-slate-400 border-blue-400 shadow-blue-500/30'
                            : 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 border-slate-300 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex justify-between px-0.5">
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                        </div>
                        <div className="space-y-1 my-auto">
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                        </div>
                        <div className="text-[7px] xl:text-[10px] font-black tracking-tighter text-slate-950 text-center uppercase truncate">
                          CLUTCH
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. REAL BRAKE PEDAL (CENTER - WIDE) */}
                  <div className="flex items-center justify-center gap-1 xl:gap-2 select-none">
                    <div className="w-1.5 xl:w-2.5 h-16 xl:h-24 bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden flex flex-col justify-end shrink-0">
                      <div
                        className="w-full bg-red-500 transition-all duration-75"
                        style={{ height: `${Math.round(controlInputs.brake * 100)}%` }}
                      />
                    </div>

                    <div
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        handlePedalPointer('brake', e, true);
                      }}
                      onPointerMove={(e) => handlePedalPointer('brake', e, true)}
                      onPointerUp={() => onControlChange('brake', 0)}
                      onPointerCancel={() => onControlChange('brake', 0)}
                      className="relative flex flex-col items-center cursor-pointer group touch-none"
                    >
                      <div className="w-2.5 h-2 xl:h-4 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-t" />
                      <div
                        style={{
                          transform: `perspective(220px) rotateX(${
                            controlInputs.brake * 25
                          }deg) translateY(${controlInputs.brake * 4}px)`,
                        }}
                        className={`w-12 sm:w-16 xl:w-24 h-16 xl:h-24 rounded-lg xl:rounded-xl border xl:border-2 transition-transform duration-75 flex flex-col justify-between p-1 xl:p-2 shadow-xl ${
                          controlInputs.brake > 0.05
                            ? 'bg-gradient-to-b from-red-500 via-slate-300 to-slate-400 border-red-400 shadow-red-500/40'
                            : 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 border-slate-300 hover:border-red-400'
                        }`}
                      >
                        <div className="flex justify-between px-0.5">
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                          <span className="w-1 h-1 rounded-full bg-slate-800" />
                        </div>
                        <div className="space-y-1 my-auto">
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                          <div className="h-1 xl:h-2 w-full bg-slate-900/90 rounded-sm" />
                        </div>
                        <div className="text-[7px] xl:text-[10px] font-black tracking-tighter text-slate-950 text-center uppercase truncate">
                          BRAKE
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. REAL ACCELERATOR / GAS PEDAL (RIGHT - TALL ORGAN PEDAL) */}
                  <div className="flex items-center justify-center gap-1 xl:gap-2 select-none">
                    <div className="w-1.5 xl:w-2.5 h-16 xl:h-24 bg-slate-950 rounded-full border border-slate-800 relative overflow-hidden flex flex-col justify-end shrink-0">
                      <div
                        className="w-full bg-emerald-500 transition-all duration-75"
                        style={{ height: `${Math.round(controlInputs.accel * 100)}%` }}
                      />
                    </div>

                    <div
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        handlePedalPointer('accel', e, true);
                      }}
                      onPointerMove={(e) => handlePedalPointer('accel', e, true)}
                      onPointerUp={() => onControlChange('accel', 0)}
                      onPointerCancel={() => onControlChange('accel', 0)}
                      className="relative flex flex-col items-center cursor-pointer group touch-none"
                    >
                      <div
                        style={{
                          transform: `perspective(220px) rotateX(${
                            controlInputs.accel * 28
                          }deg) translateY(${controlInputs.accel * 4}px)`,
                        }}
                        className={`w-11 sm:w-14 xl:w-16 h-18 xl:h-28 rounded-lg xl:rounded-xl border xl:border-2 transition-transform duration-75 flex flex-col justify-between p-1 xl:p-2 shadow-xl ${
                          controlInputs.accel > 0.05
                            ? 'bg-gradient-to-b from-emerald-400 via-slate-300 to-slate-400 border-emerald-400 shadow-emerald-500/40'
                            : 'bg-gradient-to-b from-slate-300 via-slate-400 to-slate-500 border-slate-300 hover:border-emerald-400'
                        }`}
                      >
                        <div className="flex justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                        </div>
                        <div className="space-y-1 my-auto">
                          <div className="h-1 xl:h-1.5 w-full bg-slate-900/90 rounded-full" />
                          <div className="h-1 xl:h-1.5 w-full bg-slate-900/90 rounded-full" />
                          <div className="h-1 xl:h-1.5 w-full bg-slate-900/90 rounded-full" />
                          <div className="h-1 xl:h-1.5 w-full bg-slate-900/90 rounded-full" />
                        </div>
                        <div className="text-[7px] xl:text-[10px] font-black tracking-tighter text-slate-950 text-center uppercase">
                          GAS
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
