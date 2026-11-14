'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { CAR_CATALOG, CarConfig } from '@/lib/cars';
import { DriverStats } from '@/lib/missions';
import { Car, Lock, CheckCircle, Key, X } from 'lucide-react';

interface GarageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DriverStats;
  selectedCar: CarConfig;
  onSelectCar: (car: CarConfig) => void;
  onUnlockCar: (carId: string) => void;
}

// Shared offscreen WebGL renderer so all 5 car cards render real Three.js 3D models using only 1 WebGL context
let sharedShowroomRenderer: THREE.WebGLRenderer | null = null;
const RENDER_W = 320;
const RENDER_H = 110;

function getSharedShowroomRenderer(): THREE.WebGLRenderer | null {
  if (typeof window === 'undefined') return null;
  if (!sharedShowroomRenderer) {
    try {
      sharedShowroomRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      sharedShowroomRenderer.outputColorSpace = THREE.SRGBColorSpace;
      sharedShowroomRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      sharedShowroomRenderer.toneMappingExposure = 1.25;
      sharedShowroomRenderer.setSize(RENDER_W, RENDER_H, false);
    } catch {
      return null;
    }
  }
  return sharedShowroomRenderer;
}

/**
 * Builds a tailored Three.js 3D Car Model + Showroom Turntable for the given CarConfig
 */
function createShowroom3DCarScene(car: CarConfig): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  turntableGroup: THREE.Group;
  dispose: () => void;
} {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060b16);

  const camera = new THREE.PerspectiveCamera(36, RENDER_W / RENDER_H, 0.1, 50);
  // Positioned slightly further back so the 3D car looks compact, complete, and clearly 3D
  camera.position.set(4.8, 2.25, 5.4);
  camera.lookAt(0, 0.52, 0);

  // Studio 3-Point Lighting for crisp 3D highlights
  const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x0f172a, 1.25);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.3);
  rimLight.position.set(-6, 4, -5);
  scene.add(rimLight);

  const fillLight = new THREE.DirectionalLight(new THREE.Color(car.accentColor), 0.9);
  fillLight.position.set(0, -2, 5);
  scene.add(fillLight);

  const turntableGroup = new THREE.Group();
  scene.add(turntableGroup);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };

  // 1. 3D Showroom Turntable Platform
  const podiumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.25,
    })
  );
  const podium = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(2.35, 2.5, 0.12, 32)),
    podiumMat
  );
  podium.position.y = -0.06;
  turntableGroup.add(podium);

  // Glowing Neon Accent Ring around Turntable
  const ringMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(car.accentColor),
    })
  );
  const neonRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(2.38, 0.035, 8, 48)),
    ringMat
  );
  neonRing.rotation.x = Math.PI / 2;
  neonRing.position.y = 0.01;
  turntableGroup.add(neonRing);

  // 2. Materials for the 3D Car
  const bodyMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(car.accentColor),
      metalness: 0.78,
      roughness: 0.2,
    })
  );
  const darkTrimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x111827,
      metalness: 0.6,
      roughness: 0.35,
    })
  );
  const glassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.95,
      roughness: 0.08,
    })
  );
  const rimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.15,
    })
  );
  const tireMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.85,
    })
  );
  const headlightMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xe0f2fe }));
  const taillightMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xef4444 }));

  // Scale down car slightly inside turntable so it looks compact ("chota kro")
  const carGroup = new THREE.Group();
  carGroup.scale.set(0.76, 0.76, 0.76);
  turntableGroup.add(carGroup);

  // Proportions based on car.type
  const isSuv = car.type === 'suv';
  const isHatch = car.type === 'hatchback';
  const isSuper = car.type === 'supercar';
  const isSports = car.type === 'sports';

  const bodyLength = isHatch ? 3.55 : isSuper ? 4.35 : 4.15;
  const bodyWidth = isSuper ? 2.02 : isSports ? 1.92 : isSuv ? 1.95 : 1.82;
  const chassisHeight = isSuv ? 0.68 : isSuper ? 0.44 : isSports ? 0.48 : 0.54;
  const groundClearance = isSuv ? 0.34 : isSuper ? 0.22 : 0.26;

  // Lower 3D Body Chassis
  const lowerBody = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth, chassisHeight, bodyLength)),
    bodyMat
  );
  lowerBody.position.set(0, groundClearance + chassisHeight * 0.5, 0);
  carGroup.add(lowerBody);

  // Sculpted Front Hood Slope
  const hood = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 0.92, 0.12, bodyLength * 0.34)),
    bodyMat
  );
  hood.position.set(0, groundClearance + chassisHeight + 0.03, bodyLength * 0.28);
  hood.rotation.x = 0.08;
  carGroup.add(hood);

  // 3D Cabin Greenhouse (Roof & Tinted Windows)
  const cabinLength = isSuv
    ? bodyLength * 0.62
    : isHatch
      ? bodyLength * 0.58
      : bodyLength * 0.48;
  const cabinHeight = isSuv ? 0.54 : isSuper ? 0.34 : isSports ? 0.38 : 0.44;
  const cabinZ = isSuv ? -0.22 : isHatch ? -0.25 : isSuper ? -0.05 : -0.15;

  const cabinGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 0.84, cabinHeight, cabinLength)),
    glassMat
  );
  cabinGlass.position.set(
    0,
    groundClearance + chassisHeight + cabinHeight * 0.48,
    cabinZ
  );
  carGroup.add(cabinGlass);

  // Painted Roof Cap on top of Cabin
  const roofCap = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 0.82, 0.07, cabinLength * 0.92)),
    bodyMat
  );
  roofCap.position.set(
    0,
    groundClearance + chassisHeight + cabinHeight - 0.01,
    cabinZ
  );
  carGroup.add(roofCap);

  // Front Grille & Splitter
  const grille = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 0.72, chassisHeight * 0.52, 0.08)),
    darkTrimMat
  );
  grille.position.set(0, groundClearance + chassisHeight * 0.42, bodyLength * 0.5 + 0.01);
  carGroup.add(grille);

  const splitter = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 1.02, 0.07, 0.24)),
    darkTrimMat
  );
  splitter.position.set(0, groundClearance - 0.02, bodyLength * 0.5);
  carGroup.add(splitter);

  // Left & Right 3D Wing Mirrors
  [-1, 1].forEach((side) => {
    const mirror = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.18, 0.1, 0.12)),
      bodyMat
    );
    mirror.position.set(
      side * (bodyWidth * 0.5 + 0.06),
      groundClearance + chassisHeight + 0.08,
      bodyLength * 0.14
    );
    carGroup.add(mirror);
  });

  // Glowing 3D LED Headlights & Taillights
  [-1, 1].forEach((side) => {
    const hl = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(bodyWidth * 0.22, 0.12, 0.1)),
      headlightMat
    );
    hl.position.set(
      side * (bodyWidth * 0.34),
      groundClearance + chassisHeight * 0.68,
      bodyLength * 0.5 + 0.01
    );
    carGroup.add(hl);
  });

  const tlBar = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(bodyWidth * 0.88, 0.12, 0.08)),
    taillightMat
  );
  tlBar.position.set(
    0,
    groundClearance + chassisHeight * 0.68,
    -bodyLength * 0.5 - 0.01
  );
  carGroup.add(tlBar);

  // Sport Rear Wing Spoiler for Sports / Supercar, or Roof Rack for SUV
  if (isSports || isSuper) {
    const wingBlade = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(bodyWidth * 0.96, 0.06, 0.28)),
      darkTrimMat
    );
    wingBlade.position.set(
      0,
      groundClearance + chassisHeight + 0.24,
      -bodyLength * 0.45
    );
    carGroup.add(wingBlade);

    [-0.55, 0.55].forEach((sx) => {
      const strut = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.06, 0.24, 0.14)),
        darkTrimMat
      );
      strut.position.set(
        sx,
        groundClearance + chassisHeight + 0.12,
        -bodyLength * 0.45
      );
      carGroup.add(strut);
    });
  } else if (isSuv) {
    [-0.65, 0.65].forEach((rx) => {
      const rail = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(0.05, 0.06, cabinLength * 0.85)),
        rimMat
      );
      rail.position.set(
        rx,
        groundClearance + chassisHeight + cabinHeight + 0.04,
        cabinZ
      );
      carGroup.add(rail);
    });
  }

  // 3. Four Detailed 3D Wheels with Alloy Rims
  const wheelRadius = isSuv ? 0.42 : 0.36;
  const wheelWidth = isSuper || isSports ? 0.28 : 0.24;
  const wheelZOffset = bodyLength * 0.33;
  const wheelXOffset = bodyWidth * 0.5 + 0.02;

  const tireGeo = trackGeo(
    new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 20)
  );
  tireGeo.rotateZ(Math.PI / 2);

  const rimGeo = trackGeo(
    new THREE.CylinderGeometry(wheelRadius * 0.65, wheelRadius * 0.65, wheelWidth + 0.02, 12)
  );
  rimGeo.rotateZ(Math.PI / 2);

  const wheelCoords: [number, number][] = [
    [-wheelXOffset, wheelZOffset],
    [wheelXOffset, wheelZOffset],
    [-wheelXOffset, -wheelZOffset],
    [wheelXOffset, -wheelZOffset],
  ];

  wheelCoords.forEach(([wx, wz]) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(wx, wheelRadius, wz);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    wGroup.add(tire);
    wGroup.add(rim);
    carGroup.add(wGroup);
  });

  // Initial showcase angle showing front grille, headlights, hood, cabin, and side wheels in 3D
  turntableGroup.rotation.y = -0.62;

  return {
    scene,
    camera,
    turntableGroup,
    dispose: () => {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}

const CarShowroomPhotoCanvas: React.FC<{ car: CarConfig }> = ({ car }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderer = getSharedShowroomRenderer();
    const showroom = createShowroom3DCarScene(car);

    let animId = 0;
    let angle = -0.62;

    const renderFrame = () => {
      angle += 0.012;
      showroom.turntableGroup.rotation.y = angle;

      if (renderer) {
        renderer.render(showroom.scene, showroom.camera);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
      }
      animId = requestAnimationFrame(renderFrame);
    };

    // Render first 3D frame immediately
    if (renderer) {
      renderer.render(showroom.scene, showroom.camera);
      ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);
    }
    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      showroom.dispose();
    };
  }, [car]);

  return (
    <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-800/90 bg-slate-950 mt-2 shadow-inner">
      <canvas
        ref={canvasRef}
        width={RENDER_W}
        height={RENDER_H}
        className="w-full h-full object-contain"
      />
      <span
        className="absolute top-1.5 left-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white shadow"
        style={{ backgroundColor: `${car.accentColor}cc` }}
      >
        3D {car.type}
      </span>
      <span className="absolute top-1.5 right-2 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-slate-900/85 text-slate-200 border border-slate-700/80">
        {car.topSpeedKmH} KM/H · {car.horsePower} HP
      </span>
    </div>
  );
};

export const GarageModal: React.FC<GarageModalProps> = ({
  isOpen,
  onClose,
  stats,
  selectedCar,
  onSelectCar,
  onUnlockCar,
}) => {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">3D Vehicle Showroom</h2>
              <p className="text-[11px] text-slate-400">
                Tap any 3D rotating vehicle model below to drive immediately
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cars Showcase Grid */}
        <div className="p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {CAR_CATALOG.map((car) => {
            const isUnlocked = true;
            const isSelected = selectedCar.id === car.id;
            const canUnlock = stats.level >= car.levelRequired || stats.xp >= car.xpRequired;

            return (
              <div
                key={car.id}
                onClick={() => {
                  onSelectCar(car);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/30 border-blue-500/80 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                    : isUnlocked
                    ? 'bg-slate-950/60 border-slate-800 hover:border-blue-500/50'
                    : 'bg-slate-950/20 border-slate-800/80 opacity-75'
                }`}
              >
                {/* Accent Color Strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: car.accentColor }}
                />

                <div>
                  {/* Title & Level Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 leading-tight">{car.name}</h3>
                      <p className="text-[11px] text-slate-400 capitalize">
                        {car.type} · {car.maxGears}-Speed {car.isAutomaticDefault ? 'Auto' : 'Manual'}
                      </p>
                    </div>

                    {!isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Lock className="w-3 h-3" />
                        <span>Lv {car.levelRequired}</span>
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-300">
                        <CheckCircle className="w-3 h-3" />
                        <span>ACTIVE</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Compact Live 3D Rotating Car Model Preview */}
                  <CarShowroomPhotoCanvas car={car} />

                  {/* Compact Specs Row */}
                  <div className="grid grid-cols-3 gap-1.5 mt-2 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800 text-center">
                    <div>
                      <div className="text-[9px] text-slate-400">Top Speed</div>
                      <div className="text-[11px] font-bold text-slate-200">{car.topSpeedKmH} km/h</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Power</div>
                      <div className="text-[11px] font-bold text-slate-200">{car.horsePower} HP</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-400">Trim</div>
                      <div className="text-[11px] font-bold text-slate-200 capitalize">
                        {car.interiorStyle.trimMaterial}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Select or Unlock Action Button */}
                <div className="mt-2.5">
                  {isUnlocked ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCar(car);
                        onClose();
                      }}
                      disabled={isSelected}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      }`}
                    >
                      <span>{isSelected ? 'Currently Driving' : 'Select Vehicle'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUnlockCar(car.id);
                        triggerConfetti();
                      }}
                      disabled={!canUnlock}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        canUnlock
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/30'
                          : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>
                        {canUnlock ? `Unlock (${car.xpRequired} XP)` : `Requires Lv ${car.levelRequired}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
