'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CarConfig } from '@/lib/cars';
import { CityMap, HumanHindiDialogue } from '@/lib/city-builder';
import { Car3DModel } from './CarModel';
import { audioEngine } from '@/lib/audio';
import { DriverStats } from '@/lib/missions';

export type CameraViewMode = 'cockpit' | 'chase' | 'hood' | 'orbit';

interface DrivingCanvasProps {
  stats: DriverStats;
  selectedCar: CarConfig;
  onUpdateTelemetry: (telemetry: {
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
  }) => void;
  onStallOccurred: () => void;
  onMissionProgress: (type: string, data: number) => void;
  onRuleEvent?: (deltaCoins: number, message: string) => void;
  onHumanDialogue?: (dialogue: HumanHindiDialogue) => void;
  controlInputs: {
    clutch: number;  // 0 to 1
    brake: number;   // 0 to 1
    accel: number;   // 0 to 1
    steering: number;// -1 to +1
    gear: number;    // -1, 0, 1, 2, ...
    horn: boolean;
    headlights: boolean;
    highBeam: boolean;
    hazardLights: boolean;
    turnSignalLeft: boolean;
    turnSignalRight: boolean;
    wipers: boolean;
    isEngineRunning: boolean;
  };
  cameraMode: CameraViewMode;
  introStage?: 'city_drive' | 'logo_reveal' | 'driving';
  isRainy: boolean;
  isNight: boolean;
  onIgnitionStart: () => void;
}

export const DrivingCanvas: React.FC<DrivingCanvasProps> = ({
  stats,
  selectedCar,
  onUpdateTelemetry,
  onStallOccurred,
  onMissionProgress,
  onRuleEvent,
  onHumanDialogue,
  controlInputs,
  cameraMode,
  introStage = 'driving',
  isRainy,
  isNight,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Mutable Physics & Traffic Rule State
  const physicsState = useRef({
    speedMs: 0,
    rpm: selectedCar.idleRpm,
    isStalled: false,
    isEngineRunning: true,
    distanceMeters: 0,
    pendingMissionDist: 0,
    cleanDistanceCounter: 0,
    carPosition: new THREE.Vector3(4.5, 0, 0),
    carRotationY: 0,
    steeringAngleRad: 0,
    currentGear: 1,
    lastCollisionPenaltyTime: 0,
    lastOverspeedPenaltyTime: 0,
    lastTelemetryEmitTime: 0,
    lastMissionEmitTime: 0,
    lastHumanDialogueTime: 0,
    lastHumanDialogueText: '',
    lastRedStopRewardedKey: '',
    lastSignalCrossedKey: '',
    frameCounter: 0,
    introElapsedSec: 0,
  });

  const controlsRef = useRef(controlInputs);
  useEffect(() => {
    controlsRef.current = controlInputs;
  }, [controlInputs]);

  const cameraModeRef = useRef<CameraViewMode>(cameraMode);
  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  const introStageRef = useRef<'city_drive' | 'logo_reveal' | 'driving'>(introStage);
  useEffect(() => {
    const prev = introStageRef.current;
    introStageRef.current = introStage;
    if (prev !== 'driving' && introStage === 'driving') {
      // Reset car cleanly to starting line on Embassy Central Ave when entering cockpit driving screen
      physicsState.current.carPosition.set(4.5, 0, 0);
      physicsState.current.carRotationY = 0;
      physicsState.current.speedMs = 0;
      physicsState.current.rpm = selectedCar.idleRpm;
      physicsState.current.currentGear = 1;
      physicsState.current.steeringAngleRad = 0;
      physicsState.current.introElapsedSec = 0;
    } else if (introStage === 'city_drive' && prev === 'driving') {
      physicsState.current.carPosition.set(4.5, 0, -25);
      physicsState.current.carRotationY = 0;
      physicsState.current.introElapsedSec = 0;
    }
  }, [introStage, selectedCar.idleRpm]);

  const transmissionModeRef = useRef(stats.transmissionMode);
  useEffect(() => {
    transmissionModeRef.current = stats.transmissionMode;
  }, [stats.transmissionMode]);

  const callbacksRef = useRef({
    onUpdateTelemetry,
    onStallOccurred,
    onMissionProgress,
    onRuleEvent,
    onHumanDialogue,
  });
  useEffect(() => {
    callbacksRef.current = {
      onUpdateTelemetry,
      onStallOccurred,
      onMissionProgress,
      onRuleEvent,
      onHumanDialogue,
    };
  }, [onUpdateTelemetry, onStallOccurred, onMissionProgress, onRuleEvent, onHumanDialogue]);

  useEffect(() => {
    const currentContainer = mountRef.current;
    if (!currentContainer) return;

    // Detect software WebGL as mandated by Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer Setup (Tuned for 60 FPS Zero-Lag Performance)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNight ? 0x020617 : 0x38bdf8);
    scene.fog = new THREE.FogExp2(isNight ? 0x020617 : 0x38bdf8, 0.0042);

    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.2,
      360
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    // Cap pixel ratio to 1.25 to prevent mobile Retina 9x fill-rate lag
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    currentContainer.appendChild(renderer.domElement);

    // Studio Environment Reflection Map (only on hardware GPU)
    if (!isSoftwareGl) {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    }

    // 2. Lighting Rig
    const sunLight = new THREE.DirectionalLight(isNight ? 0x38bdf8 : 0xfffbe1, isNight ? 0.35 : 1.5);
    sunLight.position.set(100, 150, 80);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 512;
    sunLight.shadow.mapSize.height = 512;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 260;
    const d = 75;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    scene.add(sunLight);
    scene.add(sunLight.target);

    const hemiLight = new THREE.HemisphereLight(
      isNight ? 0x020617 : 0x87ceeb,
      isNight ? 0x0f172a : 0x1e293b,
      isNight ? 0.45 : 0.85
    );
    scene.add(hemiLight);

    // 3. Generate City Map & Player 3D Car
    const city = new CityMap(scene);
    city.generateCity();

    const carModel = new Car3DModel(selectedCar);
    scene.add(carModel.group);
    carModel.group.position.copy(physicsState.current.carPosition);

    // Live Rearview Mirror ("Back Glass") & Left/Right Side Mirror ("Side Glass") Render Targets & Cameras
    const rtWidth = isSoftwareGl ? 128 : 200;
    const rtHeight = isSoftwareGl ? 64 : 100;
    const centerMirrorRT = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    const leftMirrorRT = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
    const rightMirrorRT = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

    centerMirrorRT.texture.colorSpace = THREE.SRGBColorSpace;
    leftMirrorRT.texture.colorSpace = THREE.SRGBColorSpace;
    rightMirrorRT.texture.colorSpace = THREE.SRGBColorSpace;

    const centerRearCam = new THREE.PerspectiveCamera(62, 2.5, 0.5, 165);
    const leftRearCam = new THREE.PerspectiveCamera(58, 1.7, 0.5, 145);
    const rightRearCam = new THREE.PerspectiveCamera(58, 1.7, 0.5, 145);

    carModel.setMirrorTextures(
      centerMirrorRT.texture,
      leftMirrorRT.texture,
      rightMirrorRT.texture
    );

    // 4. Rain Particles (if rainy)
    let rainParticles: THREE.Points | null = null;
    if (isRainy) {
      const rainGeo = new THREE.BufferGeometry();
      const rainCount = 1200;
      const posArray = new Float32Array(rainCount * 3);
      for (let i = 0; i < rainCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 160;
        posArray[i + 1] = Math.random() * 45;
        posArray[i + 2] = (Math.random() - 0.5) * 160;
      }
      rainGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const rainMat = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.15,
        transparent: true,
        opacity: 0.6,
      });
      rainParticles = new THREE.Points(rainGeo, rainMat);
      scene.add(rainParticles);
    }

    // 5. Game & Physics Loop
    let lastTime = performance.now();
    let animFrameId: number;

    const tick = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const inp = controlsRef.current;
      const state = physicsState.current;
      const callbacks = callbacksRef.current;
      const activeCamMode = cameraModeRef.current;
      const activeIntroStage = introStageRef.current;
      const activeTransMode = transmissionModeRef.current;
      state.frameCounter++;

      // Engine is ALWAYS STARTED per user request ("car always srt he rheye gee")
      state.isEngineRunning = true;
      state.isStalled = false;

      // Automated Cinematic City Driving Demo during Intro Sequence ('city_drive' & 'logo_reveal')
      if (activeIntroStage !== 'driving') {
        state.introElapsedSec += delta;
        state.speedMs = 19.5; // ~70 KM/H smooth city cruise
        state.currentGear = 3;
        state.rpm = 4850 + Math.sin(state.introElapsedSec * 3.5) * 320;
        state.steeringAngleRad = 0;
        state.carRotationY = 0;
        state.carPosition.x = 4.5;
        state.carPosition.z += state.speedMs * delta;
      } else {

      // Automatic Mode Gear Selection Logic (matched to per-gear speed ceilings)
      if (activeTransMode === 'automatic') {
        const currentSpeedKmH = Math.abs(state.speedMs * 3.6);
        if (inp.gear === -1) {
          state.currentGear = -1;
        } else if (inp.gear === 0) {
          state.currentGear = 0;
        } else if (currentSpeedKmH < 27) state.currentGear = 1;
        else if (currentSpeedKmH < 56) state.currentGear = 2;
        else if (currentSpeedKmH < 90) state.currentGear = 3;
        else if (currentSpeedKmH < 128) state.currentGear = 4;
        else if (currentSpeedKmH < 168 || selectedCar.maxGears <= 5) state.currentGear = 5;
        else state.currentGear = 6;
      } else {
        state.currentGear = inp.gear;
      }

      // Per-Gear Speed Ceilings (KM/H) so the car picks up speed ("race pakde") strictly according to Gear!
      const getGearMaxSpeedKmH = (gear: number): number => {
        if (gear === -1) return 28;
        if (gear <= 0) return 0;
        const top = selectedCar.topSpeedKmH;
        switch (gear) {
          case 1:
            return 30;
          case 2:
            return 60;
          case 3:
            return 95;
          case 4:
            return 135;
          case 5:
            return Math.min(top, 175);
          default:
            return top;
        }
      };

      // Steering Physics
      const maxSteerRad = (selectedCar.steeringAngleMax * Math.PI) / 180;
      state.steeringAngleRad = inp.steering * maxSteerRad;

      // Effective Clutch Value
      const effectiveClutch = activeTransMode === 'automatic'
        ? (state.currentGear === 0 ? 1 : 0)
        : inp.clutch;

      // Engine & Transmission Physics Simulation
      const isNeutralOrClutched = state.currentGear === 0 || effectiveClutch > 0.8;

      if (isNeutralOrClutched) {
        const targetRpm = selectedCar.idleRpm + inp.accel * (selectedCar.redlineRpm - selectedCar.idleRpm);
        state.rpm += (targetRpm - state.rpm) * 10 * delta;

        if (state.speedMs > 0) {
          state.speedMs = Math.max(0, state.speedMs - (2.0 + inp.brake * 22.0) * delta);
        } else if (state.speedMs < 0) {
          state.speedMs = Math.min(0, state.speedMs + (2.0 + inp.brake * 22.0) * delta);
        }
      } else {
        const gearMaxKmH = getGearMaxSpeedKmH(state.currentGear);
        const gearMaxMs = gearMaxKmH / 3.6;
        const currentAbsKmH = Math.abs(state.speedMs * 3.6);

        // Compute optimal speed band for the selected gear
        const prevGearMaxKmH = state.currentGear > 1 ? getGearMaxSpeedKmH(state.currentGear - 1) : 0;
        // If driver selects too high a gear at very low speed, engine lugs slightly until speed builds
        const lowSpeedLugFactor =
          state.currentGear <= 2
            ? 1.0
            : Math.max(0.38, Math.min(1.0, (currentAbsKmH + 12) / (prevGearMaxKmH * 0.85)));

        const basePower = (selectedCar.horsePower / selectedCar.massKg) * 48;
        // Gear acceleration rate scales so every gear pulls strongly up to its gear ceiling
        const gearPullMultiplier =
          state.currentGear === 1
            ? 1.45
            : state.currentGear === 2
              ? 1.25
              : state.currentGear === 3
                ? 1.12
                : state.currentGear === 4
                  ? 1.0
                  : 0.92;

        const accelRateMs2 = inp.accel * basePower * gearPullMultiplier * lowSpeedLugFactor;

        if (state.currentGear > 0) {
          if (state.speedMs < gearMaxMs) {
            // Accelerate up to the current gear's maximum speed ceiling
            state.speedMs = Math.min(gearMaxMs, state.speedMs + accelRateMs2 * delta);
          } else if (state.speedMs > gearMaxMs) {
            // Engine compression braking when downshifting into a lower gear whose max speed is lower
            state.speedMs = Math.max(gearMaxMs, state.speedMs - 9.5 * delta);
          }
        } else if (state.currentGear === -1) {
          if (state.speedMs > -gearMaxMs) {
            state.speedMs = Math.max(-gearMaxMs, state.speedMs - accelRateMs2 * 0.9 * delta);
          }
        }

        // Apply braking and natural rolling/engine drag strictly toward 0 (never reverses the car)
        const decelRate = (inp.accel < 0.05 ? 1.8 : 0.25) + inp.brake * 28.0;
        if (state.speedMs > 0) {
          state.speedMs = Math.max(0, state.speedMs - decelRate * delta);
        } else if (state.speedMs < 0) {
          state.speedMs = Math.min(0, state.speedMs + decelRate * delta);
        }

        // Compute realistic Engine RPM proportional to where current speed sits inside this gear's speed band
        const gearProgress = gearMaxMs > 0 ? Math.min(1.0, Math.abs(state.speedMs) / gearMaxMs) : 0;
        const targetGearRpm =
          selectedCar.idleRpm +
          gearProgress * (selectedCar.redlineRpm - selectedCar.idleRpm * 1.05) +
          inp.accel * 220;

        state.rpm = Math.max(
          selectedCar.idleRpm,
          Math.min(selectedCar.redlineRpm, THREE.MathUtils.lerp(state.rpm, targetGearRpm, 12 * delta))
        );
      }

      // Move Vehicle Position in 3D Space
      if (Math.abs(state.speedMs) > 0.01) {
        const turnRadius = 3.2 / Math.tan(state.steeringAngleRad || 0.0001);
        const angularVelocity = state.speedMs / turnRadius;
        // Negative Y rotation turns toward -X (Right) when steering > 0, and toward +X (Left) when steering < 0
        state.carRotationY -= angularVelocity * delta;

        const forwardDir = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), state.carRotationY);
        state.carPosition.addScaledVector(forwardDir, state.speedMs * delta);

        // Enforce strict Road-Only driving & solid Building/Curb/Traffic collisions
        const prevSpeed = Math.abs(state.speedMs);
        const roadCheck = city.constrainCarToRoad(
          state.carPosition,
          state.carRotationY,
          state.speedMs
        );
        state.carRotationY = roadCheck.rotationY;
        state.speedMs = roadCheck.speedMs;

        if (roadCheck.hitPedestrian || (roadCheck.collided && prevSpeed > 2.2)) {
          audioEngine.playCollision(Math.min(1, Math.max(0.4, prevSpeed / 15)));
          if (roadCheck.hitPedestrian) {
            const hitCheck = city.checkHumanHindiDialogue(
              state.carPosition,
              prevSpeed * 3.6,
              inp.horn,
              true
            );
            if (hitCheck) {
              state.lastHumanDialogueTime = now;
              state.lastHumanDialogueText = hitCheck.dialogue.hindi;
              callbacks.onHumanDialogue?.(hitCheck.dialogue);
              audioEngine.speakHindiDialogue(hitCheck.dialogue.hindi);
            }
          }
          if (now - state.lastCollisionPenaltyTime > 2200) {
            state.lastCollisionPenaltyTime = now;
            state.cleanDistanceCounter = 0;
            if (roadCheck.hitPedestrian) {
              callbacks.onRuleEvent?.(-3, 'Rule Broken: Hit Pedestrian on Crosswalk! (-3 Coins)');
            } else {
              callbacks.onRuleEvent?.(-2, 'Rule Broken: Curb / Traffic Crash! (-2 Coins)');
            }
          }
        }

        const stepDist = Math.abs(state.speedMs) * delta;
        state.distanceMeters += stepDist;
        state.pendingMissionDist += stepDist;
        if (now - state.lastMissionEmitTime > 450 && state.pendingMissionDist > 1.0) {
          const distToSend = state.pendingMissionDist;
          state.pendingMissionDist = 0;
          state.lastMissionEmitTime = now;
          callbacks.onMissionProgress('distance', distToSend);
        }

        // Clean Driving & Express Highway Rule Check
        const currentRoadInfo = CityMap.getRoadInfo(state.carPosition.x, state.carPosition.z);
        const currentSpeedKmH = Math.abs(state.speedMs * 3.6);
        const activeSpeedLimit = currentRoadInfo.speedLimitKmH; // 180 KM/H on Highway, 105 KM/H on Street

        if (!roadCheck.collided && currentSpeedKmH >= 10 && currentSpeedKmH <= activeSpeedLimit) {
          state.cleanDistanceCounter += stepDist;
          if (state.cleanDistanceCounter >= 55) {
            state.cleanDistanceCounter = 0;
            if (currentRoadInfo.isHighway && currentSpeedKmH >= 65) {
              callbacks.onRuleEvent?.(
                2,
                `Express Highway Fast Cruise on ${currentRoadInfo.roadName}! (+2 Coins)`
              );
            } else {
              callbacks.onRuleEvent?.(1, 'Rule Followed: Safe Lane Driving! (+1 Coin)');
            }
          }
        } else if (
          currentSpeedKmH > activeSpeedLimit &&
          now - state.lastOverspeedPenaltyTime > 3000
        ) {
          state.lastOverspeedPenaltyTime = now;
          state.cleanDistanceCounter = 0;
          callbacks.onRuleEvent?.(
            -1,
            `Rule Broken: Overspeeding > ${activeSpeedLimit} KM/H! (-1 Coin)`
          );
        }
      }
      } // end else (activeIntroStage === 'driving')

      carModel.group.position.copy(state.carPosition);
      carModel.group.rotation.y = state.carRotationY;

      // Keep directional sunlight shadow frustum following the car across the infinite city
      sunLight.position.set(
        state.carPosition.x + 100,
        150,
        state.carPosition.z + 80
      );
      sunLight.target.position.copy(state.carPosition);
      sunLight.target.updateMatrixWorld();

      const speedKmH = Math.abs(state.speedMs * 3.6);
      carModel.updateCockpit(
        state.steeringAngleRad,
        speedKmH,
        state.rpm,
        inp.clutch,
        inp.brake,
        inp.accel,
        state.currentGear,
        inp.wipers,
        delta
      );

      carModel.setHeadlights(inp.headlights, inp.highBeam);
      carModel.setBrakeLights(inp.brake > 0.1);

      audioEngine.setHorn(inp.horn);
      audioEngine.updateEngine(state.rpm, inp.accel, state.isStalled, state.isEngineRunning);

      if (speedKmH > 35 && Math.abs(inp.steering) > 0.6) {
        audioEngine.setTireSqueal(Math.abs(inp.steering));
      } else {
        audioEngine.setTireSqueal(0);
      }

      // Stream infinite city chunks & update traffic around player
      city.update(delta, state.carPosition.x, state.carPosition.z);

      // Check nearby Human Hindi Dialogues (Horn reaction, Fast pass, Polite Crosswalk Stop, or Ambient Greeting)
      if (activeIntroStage === 'driving' && state.frameCounter % 12 === 0) {
        const cooldown = inp.horn ? 1800 : 4200;
        if (now - state.lastHumanDialogueTime > cooldown) {
          const humanCheck = city.checkHumanHindiDialogue(
            state.carPosition,
            speedKmH,
            inp.horn,
            false
          );
          if (
            humanCheck &&
            (inp.horn || humanCheck.dialogue.hindi !== state.lastHumanDialogueText)
          ) {
            state.lastHumanDialogueTime = now;
            state.lastHumanDialogueText = humanCheck.dialogue.hindi;
            callbacks.onHumanDialogue?.(humanCheck.dialogue);
            audioEngine.speakHindiDialogue(humanCheck.dialogue.hindi);
          }
        }
      }

      // Evaluate Traffic Signal Rules at Nearest Intersection
      const nearestSignal = city.getNearestTrafficLight(
        state.carPosition.x,
        state.carPosition.z
      );
      if (nearestSignal.node) {
        const tl = nearestSignal.node;
        const dist = nearestSignal.distanceMeters;

        // 1. Stopped before Stop Line at a RED Traffic Light -> +2 Coins Reward!
        if (
          tl.state === 'red' &&
          dist >= 12 &&
          dist <= 24 &&
          speedKmH < 1.8 &&
          state.lastRedStopRewardedKey !== `${tl.key}_stop`
        ) {
          state.lastRedStopRewardedKey = `${tl.key}_stop`;
          callbacks.onRuleEvent?.(2, 'Rule Followed: Stopped at Red Light! (+2 Coins)');
        }

        // 2. Entered Intersection (< 10.5m) while moving (> 8 km/h)
        if (dist < 10.5 && speedKmH > 8 && state.lastSignalCrossedKey !== tl.key) {
          state.lastSignalCrossedKey = tl.key;
          if (tl.state === 'red') {
            state.cleanDistanceCounter = 0;
            callbacks.onRuleEvent?.(-3, 'Rule Broken: Jumped Red Traffic Light! (-3 Coins)');
          } else if (tl.state === 'green') {
            callbacks.onRuleEvent?.(2, 'Rule Followed: Green Signal Crossed! (+2 Coins)');
          }
        } else if (dist > 28 && state.lastSignalCrossedKey === tl.key) {
          state.lastSignalCrossedKey = '';
          state.lastRedStopRewardedKey = '';
        }
      }

      if (rainParticles) {
        rainParticles.position.set(state.carPosition.x, 0, state.carPosition.z);
        const positions = rainParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 25 * delta;
          if (positions[i] < 0) positions[i] = 40;
        }
        rainParticles.geometry.attributes.position.needsUpdate = true;
      }

      // Camera Choreography
      const carPos = carModel.group.position;
      const carRot = state.carRotationY;
      const yAxis = new THREE.Vector3(0, 1, 0);

      // Update & Render Live Rearview ("Back Glass") and Side Wing Mirrors ("Side Glass")
      // Round-robin 1 mirror pass per frame (or all 3 on first 2 frames) with shadows paused for 3x faster frame rate!
      if (activeIntroStage === 'driving' && activeCamMode === 'cockpit') {
        carModel.group.visible = false;
        const prevShadowAuto = renderer.shadowMap.autoUpdate;
        renderer.shadowMap.autoUpdate = false;

        const mirrorSlot = state.frameCounter % 3;
        const isWarmup = state.frameCounter <= 2;

        if (isWarmup || mirrorSlot === 0) {
          const centerRearPos = new THREE.Vector3(0, 1.55, -2.55).applyAxisAngle(yAxis, carRot);
          const centerRearLook = new THREE.Vector3(0, 1.3, -45).applyAxisAngle(yAxis, carRot);
          centerRearCam.position.copy(carPos).add(centerRearPos);
          centerRearCam.lookAt(carPos.clone().add(centerRearLook));
          renderer.setRenderTarget(centerMirrorRT);
          renderer.render(scene, centerRearCam);
        }

        if (isWarmup || mirrorSlot === 1) {
          const leftRearPos = new THREE.Vector3(1.18, 1.42, 0.35).applyAxisAngle(yAxis, carRot);
          const leftRearLook = new THREE.Vector3(3.4, 1.2, -35).applyAxisAngle(yAxis, carRot);
          leftRearCam.position.copy(carPos).add(leftRearPos);
          leftRearCam.lookAt(carPos.clone().add(leftRearLook));
          renderer.setRenderTarget(leftMirrorRT);
          renderer.render(scene, leftRearCam);
        }

        if (isWarmup || mirrorSlot === 2) {
          const rightRearPos = new THREE.Vector3(-1.18, 1.42, 0.35).applyAxisAngle(yAxis, carRot);
          const rightRearLook = new THREE.Vector3(-3.4, 1.2, -35).applyAxisAngle(yAxis, carRot);
          rightRearCam.position.copy(carPos).add(rightRearPos);
          rightRearCam.lookAt(carPos.clone().add(rightRearLook));
          renderer.setRenderTarget(rightMirrorRT);
          renderer.render(scene, rightRearCam);
        }

        renderer.setRenderTarget(null);
        renderer.shadowMap.autoUpdate = prevShadowAuto;
        carModel.group.visible = true;
      }

      if (activeIntroStage === 'city_drive') {
        if (camera.fov !== 62) {
          camera.fov = 62;
          camera.updateProjectionMatrix();
        }
        const t = state.introElapsedSec;
        if (t < 1.8) {
          // Angle 1: Low-angle dramatic front-quarter city tracking shot showing spinning wheels, car & Grand Embassy skyline
          const sweepX = -4.2 + Math.sin(t * 1.1) * 1.6;
          const camOffset = new THREE.Vector3(sweepX, 1.65 + t * 0.4, 7.2 - t * 1.5);
          camera.position.copy(carPos).add(camOffset);
          camera.lookAt(carPos.clone().add(new THREE.Vector3(0, 1.35, -4.0)));
        } else {
          // Angle 2: Sweeping elevated street-crane shot showing live city traffic, pedestrians, road signs & signals
          const craneT = t - 1.8;
          const camOffset = new THREE.Vector3(
            -6.5 + craneT * 2.2,
            4.8 + craneT * 1.2,
            -9.5 + craneT * 1.4
          );
          camera.position.lerp(carPos.clone().add(camOffset), 0.16);
          camera.lookAt(carPos.clone().add(new THREE.Vector3(0, 1.5, 12.0)));
        }
      } else if (activeIntroStage === 'logo_reveal') {
        if (camera.fov !== 64) {
          camera.fov = 64;
          camera.updateProjectionMatrix();
        }
        // Smooth hero showcase orbit around the cruising car while REBEL RIDE logo is revealed
        const orbitAngle = state.introElapsedSec * 0.75;
        const heroOffset = new THREE.Vector3(
          Math.sin(orbitAngle) * 7.8,
          2.65,
          Math.cos(orbitAngle) * 7.8
        );
        camera.position.lerp(carPos.clone().add(heroOffset), 0.14);
        camera.lookAt(carPos.clone().add(new THREE.Vector3(0, 1.2, 1.5)));
      } else if (activeCamMode === 'cockpit') {
        const aspect = window.innerWidth / Math.max(1, window.innerHeight);
        const targetFov = aspect < 1.1 ? 86 : 68;
        if (camera.fov !== targetFov) {
          camera.fov = targetFov;
          camera.updateProjectionMatrix();
        }

        // Driver eye position framed so Center Back Mirror + Left & Right Side Mirrors + Steering Wheel + Road are all clearly visible
        const driverOffset = new THREE.Vector3(0.12, 1.65, -0.26).applyAxisAngle(
          yAxis,
          carRot
        );
        camera.position.copy(carPos).add(driverOffset);

        const lookTarget = carPos.clone().add(
          new THREE.Vector3(0.08 - 1.1 * inp.steering, 1.42, 18).applyAxisAngle(
            yAxis,
            carRot
          )
        );
        camera.lookAt(lookTarget);
      } else if (activeCamMode === 'chase') {
        if (camera.fov !== 65) {
          camera.fov = 65;
          camera.updateProjectionMatrix();
        }
        const chaseOffset = new THREE.Vector3(0, 3.8, -8.5).applyAxisAngle(
          yAxis,
          carRot
        );
        camera.position.lerp(carPos.clone().add(chaseOffset), 0.18);
        const chaseLook = carPos.clone().add(
          new THREE.Vector3(0, 1.3, 4.0).applyAxisAngle(yAxis, carRot)
        );
        camera.lookAt(chaseLook);
      } else if (activeCamMode === 'hood') {
        const hoodOffset = new THREE.Vector3(0, 1.25, 2.0).applyAxisAngle(
          yAxis,
          carRot
        );
        camera.position.copy(carPos).add(hoodOffset);
        const lookTarget = carPos.clone().add(
          new THREE.Vector3(0, 1.1, 16).applyAxisAngle(
            yAxis,
            carRot
          )
        );
        camera.lookAt(lookTarget);
      } else if (activeCamMode === 'orbit') {
        const time = Date.now() * 0.0005;
        const orbitOffset = new THREE.Vector3(
          Math.sin(time) * 9.5,
          4.0,
          Math.cos(time) * 9.5
        );
        camera.position.copy(carPos).add(orbitOffset);
        camera.lookAt(carPos.clone().add(new THREE.Vector3(0, 1.1, 0)));
      }

      renderer.render(scene, camera);

      // Throttle React HUD state updates to ~12 FPS (every 80ms) so React re-renders never cause 3D frame lag
      if (now - state.lastTelemetryEmitTime >= 80) {
        state.lastTelemetryEmitTime = now;
        const roadInfo = CityMap.getRoadInfo(state.carPosition.x, state.carPosition.z);

        callbacks.onUpdateTelemetry({
          speedKmH,
          rpm: Math.round(state.rpm),
          gear: state.currentGear,
          clutch: inp.clutch,
          brake: inp.brake,
          accel: inp.accel,
          isStalled: state.isStalled,
          isEngineRunning: state.isEngineRunning,
          steeringAngle: Math.round(inp.steering * selectedCar.steeringAngleMax),
          distanceDrivenMeters: Math.round(state.distanceMeters),
          carX: state.carPosition.x,
          carZ: state.carPosition.z,
          carHeadingRad: state.carRotationY,
          trafficSignalState: nearestSignal.node ? nearestSignal.node.state : 'green',
          trafficSignalDist: Math.round(nearestSignal.distanceMeters),
          trafficSignalSeconds: nearestSignal.secondsRemaining,
          roadName: roadInfo.roadName,
          cityName: roadInfo.cityName,
          isHighway: roadInfo.isHighway,
          speedLimitKmH: roadInfo.speedLimitKmH,
        });
      }

      if (isSoftwareGl) {
        const gl = renderer.getContext() as WebGL2RenderingContext;
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const syncStatus = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (syncStatus === gl.UNSIGNALED) {
            setTimeout(poll, 5);
          } else {
            gl.deleteSync(sync);
            setTimeout(() => {
              animFrameId = requestAnimationFrame(tick);
            }, 80);
          }
        };
        setTimeout(poll, 5);
      } else {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
      centerMirrorRT.dispose();
      leftMirrorRT.dispose();
      rightMirrorRT.dispose();
      renderer.dispose();
    };
  }, [selectedCar, isRainy, isNight]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
