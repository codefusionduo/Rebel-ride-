import * as THREE from 'three';
import { CarConfig } from '@/lib/cars';

export class Car3DModel {
  public group: THREE.Group;
  public config: CarConfig;

  // Interior interactive elements
  public steeringWheelGroup: THREE.Group;
  public speedNeedle: THREE.Mesh;
  public rpmNeedle: THREE.Mesh;
  public gearShifterGroup: THREE.Group;
  public clutchPedalGroup: THREE.Group;
  public brakePedalGroup: THREE.Group;
  public accelPedalGroup: THREE.Group;
  public wiperLeft: THREE.Mesh;
  public wiperRight: THREE.Mesh;

  // Live Rearview & Side Mirror Materials
  public rearMirrorGlassMat: THREE.MeshBasicMaterial;
  public leftMirrorGlassMat: THREE.MeshBasicMaterial;
  public rightMirrorGlassMat: THREE.MeshBasicMaterial;

  // Wheel meshes for rotation & steering
  public frontLeftWheel: THREE.Group;
  public frontRightWheel: THREE.Group;
  public rearLeftWheel: THREE.Group;
  public rearRightWheel: THREE.Group;

  // Lights
  public headLightLeft: THREE.SpotLight;
  public headLightRight: THREE.SpotLight;
  public headLensLeftMat: THREE.MeshBasicMaterial;
  public headLensRightMat: THREE.MeshBasicMaterial;
  public tailLightBarMat: THREE.MeshBasicMaterial;

  constructor(config: CarConfig) {
    this.config = config;
    this.group = new THREE.Group();

    const bodyColor = new THREE.Color(config.accentColor);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.85,
      roughness: 0.15,
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.7,
      roughness: 0.3,
    });

    // Clear automotive glass that never darkens or blocks 1st-person view
    const windshieldGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xe0f2fe,
      metalness: 0.05,
      roughness: 0.05,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
    });

    const interiorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.interiorStyle.dashboardColor),
      roughness: 0.45,
      metalness: 0.25,
    });

    const cabinDarkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.2,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.08,
    });

    const mirrorRimMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });

    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Live Mirror Glass Materials (receive real-time WebGLRenderTarget textures from rear cameras)
    this.rearMirrorGlassMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.leftMirrorGlassMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.rightMirrorGlassMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // 1. Lower Chassis & Sculpted Hood
    const lowerChassisGeo = new THREE.BoxGeometry(2.25, 0.72, 4.9);
    const lowerChassis = new THREE.Mesh(lowerChassisGeo, bodyMat);
    lowerChassis.position.set(0, 0.66, 0);
    lowerChassis.castShadow = true;
    lowerChassis.receiveShadow = true;
    this.group.add(lowerChassis);

    // Sculpted Front Hood visible through the windshield in 1st-person view
    const hoodGeo = new THREE.BoxGeometry(2.12, 0.12, 1.65);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.position.set(0, 1.06, 1.58);
    hoodMesh.rotation.x = 0.06;
    hoodMesh.castShadow = true;
    hoodMesh.receiveShadow = true;
    this.group.add(hoodMesh);

    // Sporty Left & Right Hood Power Ridges
    const ridgeGeo = new THREE.BoxGeometry(0.14, 0.04, 1.45);
    const leftRidge = new THREE.Mesh(ridgeGeo, bodyMat);
    leftRidge.position.set(0.62, 1.11, 1.55);
    leftRidge.rotation.x = 0.06;
    this.group.add(leftRidge);

    const rightRidge = new THREE.Mesh(ridgeGeo, bodyMat);
    rightRidge.position.set(-0.62, 1.11, 1.55);
    rightRidge.rotation.x = 0.06;
    this.group.add(rightRidge);

    // Rear Trunk Deck
    const trunkGeo = new THREE.BoxGeometry(2.15, 0.22, 1.1);
    const trunkMesh = new THREE.Mesh(trunkGeo, bodyMat);
    trunkMesh.position.set(0, 1.1, -1.9);
    this.group.add(trunkMesh);

    // Cabin Floor Tub & Side Doors
    const floorGeo = new THREE.BoxGeometry(2.15, 0.12, 2.4);
    const floorMesh = new THREE.Mesh(floorGeo, darkTrimMat);
    floorMesh.position.set(0, 0.55, -0.1);
    this.group.add(floorMesh);

    const doorLeftGeo = new THREE.BoxGeometry(0.12, 0.48, 2.1);
    const doorLeft = new THREE.Mesh(doorLeftGeo, bodyMat);
    doorLeft.position.set(1.06, 1.08, -0.05);
    this.group.add(doorLeft);

    const doorRight = new THREE.Mesh(doorLeftGeo, bodyMat);
    doorRight.position.set(-1.06, 1.08, -0.05);
    this.group.add(doorRight);

    // Front Bumper Splitter & Grille
    const grilleGeo = new THREE.BoxGeometry(2.05, 0.42, 0.25);
    const grille = new THREE.Mesh(grilleGeo, darkTrimMat);
    grille.position.set(0, 0.62, 2.45);
    this.group.add(grille);

    const splitterGeo = new THREE.BoxGeometry(2.2, 0.08, 0.4);
    const splitter = new THREE.Mesh(splitterGeo, darkTrimMat);
    splitter.position.set(0, 0.3, 2.55);
    this.group.add(splitter);

    // 2. Open-Frame Cabin Pillars, Roof & Crystal-Clear Windshield
    const aPillarGeo = new THREE.BoxGeometry(0.08, 0.95, 0.1);
    const aPillarLeft = new THREE.Mesh(aPillarGeo, darkTrimMat);
    aPillarLeft.position.set(0.98, 1.62, 0.68);
    aPillarLeft.rotation.x = -0.38;
    this.group.add(aPillarLeft);

    const aPillarRight = new THREE.Mesh(aPillarGeo, darkTrimMat);
    aPillarRight.position.set(-0.98, 1.62, 0.68);
    aPillarRight.rotation.x = -0.38;
    this.group.add(aPillarRight);

    const cPillarLeft = new THREE.Mesh(aPillarGeo, bodyMat);
    cPillarLeft.position.set(0.96, 1.62, -1.25);
    cPillarLeft.rotation.x = 0.42;
    this.group.add(cPillarLeft);

    const cPillarRight = new THREE.Mesh(aPillarGeo, bodyMat);
    cPillarRight.position.set(-0.96, 1.62, -1.25);
    cPillarRight.rotation.x = 0.42;
    this.group.add(cPillarRight);

    const roofGeo = new THREE.BoxGeometry(1.98, 0.08, 1.85);
    const roof = new THREE.Mesh(roofGeo, bodyMat);
    roof.position.set(0, 2.12, -0.35);
    this.group.add(roof);

    const windshieldGeo = new THREE.PlaneGeometry(1.92, 0.88);
    const windshield = new THREE.Mesh(windshieldGeo, windshieldGlassMat);
    windshield.position.set(0, 1.65, 0.72);
    windshield.rotation.x = -0.38;
    this.group.add(windshield);

    // 3. LIVE REARVIEW MIRRORS: Center Back-View Mirror + Left & Right Side Wing Mirrors
    // A) Center Panoramic Rearview Mirror ("Back Glass") at top of windshield
    const rearMirrorGroup = new THREE.Group();
    rearMirrorGroup.position.set(0.08, 1.88, 0.5);
    rearMirrorGroup.rotation.y = 0.06; // Slightly angled toward driver

    const mirrorStem = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), darkTrimMat);
    mirrorStem.position.y = 0.08;
    rearMirrorGroup.add(mirrorStem);

    const mirrorHousing = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.15, 0.035), darkTrimMat);
    rearMirrorGroup.add(mirrorHousing);

    const mirrorRim = new THREE.Mesh(new THREE.BoxGeometry(0.505, 0.135, 0.038), mirrorRimMat);
    rearMirrorGroup.add(mirrorRim);

    const rearMirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.49, 0.12),
      this.rearMirrorGlassMat
    );
    rearMirrorGlass.position.z = -0.021;
    rearMirrorGlass.rotation.y = Math.PI;
    rearMirrorGroup.add(rearMirrorGlass);
    this.group.add(rearMirrorGroup);

    // B) Left Side Wing Mirror ("Left Side Glass") — positioned for clear 1st-person visibility
    const leftMirrorGroup = new THREE.Group();
    leftMirrorGroup.position.set(0.82, 1.46, 0.52);
    leftMirrorGroup.rotation.y = -0.22; // Angled inward toward driver

    const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.04), bodyMat);
    leftArm.position.set(0.12, -0.02, 0.02);
    leftMirrorGroup.add(leftArm);

    const leftHousing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.06), bodyMat);
    leftMirrorGroup.add(leftHousing);

    const leftRim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.062), mirrorRimMat);
    leftMirrorGroup.add(leftRim);

    const mirrorLeftGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.285, 0.165),
      this.leftMirrorGlassMat
    );
    mirrorLeftGlass.position.z = -0.033;
    mirrorLeftGlass.rotation.y = Math.PI;
    leftMirrorGroup.add(mirrorLeftGlass);
    this.group.add(leftMirrorGroup);

    // C) Right Side Wing Mirror ("Right Side Glass") — positioned for clear 1st-person visibility
    const rightMirrorGroup = new THREE.Group();
    rightMirrorGroup.position.set(-0.68, 1.46, 0.52);
    rightMirrorGroup.rotation.y = 0.26; // Angled inward toward driver

    const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.04), bodyMat);
    rightArm.position.set(-0.16, -0.02, 0.02);
    rightMirrorGroup.add(rightArm);

    const rightHousing = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.2, 0.06), bodyMat);
    rightMirrorGroup.add(rightHousing);

    const rightRim = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.18, 0.062), mirrorRimMat);
    rightMirrorGroup.add(rightRim);

    const mirrorRightGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.285, 0.165),
      this.rightMirrorGlassMat
    );
    mirrorRightGlass.position.z = -0.033;
    mirrorRightGlass.rotation.y = Math.PI;
    rightMirrorGroup.add(mirrorRightGlass);
    this.group.add(rightMirrorGroup);

    // Rear Spoiler
    const spoilerWingGeo = new THREE.BoxGeometry(2.15, 0.07, 0.36);
    const spoilerWing = new THREE.Mesh(spoilerWingGeo, darkTrimMat);
    spoilerWing.position.set(0, 1.48, -2.35);
    this.group.add(spoilerWing);

    const spoilerPostGeo = new THREE.BoxGeometry(0.08, 0.28, 0.1);
    const postL = new THREE.Mesh(spoilerPostGeo, darkTrimMat);
    postL.position.set(0.75, 1.32, -2.35);
    this.group.add(postL);
    const postR = new THREE.Mesh(spoilerPostGeo, darkTrimMat);
    postR.position.set(-0.75, 1.32, -2.35);
    this.group.add(postR);

    // 4. Wheels Assembly with Brake Calipers
    const createWheel = () => {
      const wGroup = new THREE.Group();

      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.4, 28);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.41, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      const caliperGeo = new THREE.BoxGeometry(0.12, 0.22, 0.18);
      const caliper = new THREE.Mesh(caliperGeo, brakeCaliperMat);
      caliper.position.set(0, 0.15, 0.1);
      wGroup.add(caliper);

      return wGroup;
    };

    this.frontLeftWheel = createWheel();
    this.frontLeftWheel.position.set(1.2, 0.48, 1.5);
    this.group.add(this.frontLeftWheel);

    this.frontRightWheel = createWheel();
    this.frontRightWheel.position.set(-1.2, 0.48, 1.5);
    this.group.add(this.frontRightWheel);

    this.rearLeftWheel = createWheel();
    this.rearLeftWheel.position.set(1.2, 0.48, -1.5);
    this.group.add(this.rearLeftWheel);

    this.rearRightWheel = createWheel();
    this.rearRightWheel.position.set(-1.2, 0.48, -1.5);
    this.group.add(this.rearRightWheel);

    // 5. Glowing LED Headlights & Tail Light Bar
    this.headLightLeft = new THREE.SpotLight(0xfffbe1, 2.5, 90, Math.PI / 5, 0.3);
    this.headLightLeft.position.set(0.8, 0.85, 2.45);
    this.headLightLeft.target.position.set(0.8, 0, 30);
    this.group.add(this.headLightLeft);
    this.group.add(this.headLightLeft.target);

    this.headLightRight = new THREE.SpotLight(0xfffbe1, 2.5, 90, Math.PI / 5, 0.3);
    this.headLightRight.position.set(-0.8, 0.85, 2.45);
    this.headLightRight.target.position.set(-0.8, 0, 30);
    this.group.add(this.headLightRight);
    this.group.add(this.headLightRight.target);

    const lensGeo = new THREE.BoxGeometry(0.4, 0.18, 0.08);
    this.headLensLeftMat = new THREE.MeshBasicMaterial({ color: 0xfffbe1 });
    const lensL = new THREE.Mesh(lensGeo, this.headLensLeftMat);
    lensL.position.set(0.8, 0.85, 2.46);
    this.group.add(lensL);

    this.headLensRightMat = new THREE.MeshBasicMaterial({ color: 0xfffbe1 });
    const lensR = new THREE.Mesh(lensGeo, this.headLensRightMat);
    lensR.position.set(-0.8, 0.85, 2.46);
    this.group.add(lensR);

    const tailBarGeo = new THREE.BoxGeometry(2.05, 0.15, 0.08);
    this.tailLightBarMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const tailBar = new THREE.Mesh(tailBarGeo, this.tailLightBarMat);
    tailBar.position.set(0, 0.92, -2.46);
    this.group.add(tailBar);

    // 6. Realistic 1st-Person Cockpit Interior
    const cockpitGroup = new THREE.Group();
    cockpitGroup.position.set(0.22, 1.12, 0.32);

    const cabinLight = new THREE.PointLight(0x38bdf8, 1.2, 2.5);
    cabinLight.position.set(-0.2, 0.45, -0.15);
    cockpitGroup.add(cabinLight);

    const dashGeo = new THREE.BoxGeometry(1.96, 0.34, 0.62);
    const dashMesh = new THREE.Mesh(dashGeo, interiorMat);
    dashMesh.position.set(-0.22, 0.04, 0.36);
    cockpitGroup.add(dashMesh);

    const dashTrimGeo = new THREE.BoxGeometry(1.92, 0.025, 0.04);
    const dashTrim = new THREE.Mesh(dashTrimGeo, chromeMat);
    dashTrim.position.set(-0.22, 0.16, 0.06);
    cockpitGroup.add(dashTrim);

    // Center Dashboard Infotainment Screen
    const screenFrameGeo = new THREE.BoxGeometry(0.38, 0.22, 0.04);
    const screenFrame = new THREE.Mesh(screenFrameGeo, darkTrimMat);
    screenFrame.position.set(-0.42, 0.26, 0.22);
    screenFrame.rotation.y = 0.12;
    cockpitGroup.add(screenFrame);

    const screenDisplayGeo = new THREE.PlaneGeometry(0.34, 0.18);
    const screenDisplayMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const screenDisplay = new THREE.Mesh(screenDisplayGeo, screenDisplayMat);
    screenDisplay.position.set(-0.418, 0.26, 0.198);
    screenDisplay.rotation.y = Math.PI + 0.12;
    cockpitGroup.add(screenDisplay);

    // Driver Instrument Cluster Hood & Glowing Gauges
    const clusterBoxGeo = new THREE.BoxGeometry(0.52, 0.22, 0.22);
    const clusterBox = new THREE.Mesh(clusterBoxGeo, cabinDarkMat);
    clusterBox.position.set(0, 0.24, 0.24);
    cockpitGroup.add(clusterBox);

    const dialRingGeo = new THREE.RingGeometry(0.072, 0.086, 24);
    const speedRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const rpmRingMat = new THREE.MeshBasicMaterial({ color: 0xef4444, side: THREE.DoubleSide });

    const dialGeo = new THREE.CircleGeometry(0.082, 24);
    const dialMat = new THREE.MeshBasicMaterial({ color: 0x020617 });

    const speedDial = new THREE.Mesh(dialGeo, dialMat);
    speedDial.position.set(-0.13, 0.24, 0.128);
    speedDial.rotation.y = Math.PI;
    cockpitGroup.add(speedDial);

    const speedRing = new THREE.Mesh(dialRingGeo, speedRingMat);
    speedRing.position.set(-0.13, 0.24, 0.126);
    cockpitGroup.add(speedRing);

    const rpmDial = new THREE.Mesh(dialGeo, dialMat);
    rpmDial.position.set(0.13, 0.24, 0.128);
    rpmDial.rotation.y = Math.PI;
    cockpitGroup.add(rpmDial);

    const rpmRing = new THREE.Mesh(dialRingGeo, rpmRingMat);
    rpmRing.position.set(0.13, 0.24, 0.126);
    cockpitGroup.add(rpmRing);

    const needleGeo = new THREE.BoxGeometry(0.01, 0.07, 0.008);
    needleGeo.translate(0, 0.032, 0);

    this.speedNeedle = new THREE.Mesh(needleGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
    this.speedNeedle.position.set(-0.13, 0.24, 0.122);
    cockpitGroup.add(this.speedNeedle);

    this.rpmNeedle = new THREE.Mesh(needleGeo, new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    this.rpmNeedle.position.set(0.13, 0.24, 0.122);
    cockpitGroup.add(this.rpmNeedle);

    // Steering Column & 3-Spoke Sport Steering Wheel
    const columnGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.28);
    const column = new THREE.Mesh(columnGeo, cabinDarkMat);
    column.rotation.x = Math.PI / 2.4;
    column.position.set(0, 0.17, 0.08);
    cockpitGroup.add(column);

    this.steeringWheelGroup = new THREE.Group();
    this.steeringWheelGroup.position.set(0, 0.2, -0.04);
    this.steeringWheelGroup.rotation.x = -0.22;

    const ringGeo = new THREE.TorusGeometry(0.18, 0.025, 16, 36);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.25,
    });
    const wheelRing = new THREE.Mesh(ringGeo, wheelMat);
    this.steeringWheelGroup.add(wheelRing);

    const markerGeo = new THREE.TorusGeometry(0.18, 0.027, 12, 12, 0.22);
    const markerMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const topMarker = new THREE.Mesh(markerGeo, markerMat);
    topMarker.rotation.z = Math.PI / 2 - 0.11;
    this.steeringWheelGroup.add(topMarker);

    const hubGeo = new THREE.CylinderGeometry(0.06, 0.065, 0.03, 20);
    const hubMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.rotation.x = Math.PI / 2;
    this.steeringWheelGroup.add(hub);

    const emblemRingGeo = new THREE.TorusGeometry(0.028, 0.004, 8, 24);
    const emblemRing = new THREE.Mesh(emblemRingGeo, chromeMat);
    emblemRing.position.z = -0.017;
    this.steeringWheelGroup.add(emblemRing);

    const hSpokeGeo = new THREE.BoxGeometry(0.33, 0.024, 0.014);
    const hSpoke = new THREE.Mesh(hSpokeGeo, chromeMat);
    this.steeringWheelGroup.add(hSpoke);

    const vSpokeGeo = new THREE.BoxGeometry(0.028, 0.16, 0.014);
    const vSpoke = new THREE.Mesh(vSpokeGeo, chromeMat);
    vSpoke.position.y = -0.08;
    this.steeringWheelGroup.add(vSpoke);

    cockpitGroup.add(this.steeringWheelGroup);

    // 7. Realistic H-Pattern Gear Shifter in Center Console
    const consoleGeo = new THREE.BoxGeometry(0.34, 0.32, 0.85);
    const consoleMesh = new THREE.Mesh(consoleGeo, interiorMat);
    consoleMesh.position.set(-0.38, -0.2, -0.08);
    cockpitGroup.add(consoleMesh);

    const gatePlateGeo = new THREE.BoxGeometry(0.22, 0.02, 0.26);
    const gatePlate = new THREE.Mesh(gatePlateGeo, chromeMat);
    gatePlate.position.set(-0.38, -0.03, -0.02);
    cockpitGroup.add(gatePlate);

    const bootGeo = new THREE.ConeGeometry(0.075, 0.09, 12);
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.8 });
    const boot = new THREE.Mesh(bootGeo, bootMat);
    boot.position.set(-0.38, 0.01, -0.02);
    cockpitGroup.add(boot);

    this.gearShifterGroup = new THREE.Group();
    this.gearShifterGroup.position.set(-0.38, -0.02, -0.02);

    const shifterShaftGeo = new THREE.CylinderGeometry(0.013, 0.016, 0.24, 12);
    shifterShaftGeo.translate(0, 0.12, 0);
    const shifterShaft = new THREE.Mesh(shifterShaftGeo, chromeMat);
    this.gearShifterGroup.add(shifterShaft);

    const knobGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const knobMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.25,
    });
    const knob = new THREE.Mesh(knobGeo, knobMat);
    knob.position.y = 0.25;
    this.gearShifterGroup.add(knob);

    const knobCapGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.01, 16);
    const knobCap = new THREE.Mesh(knobCapGeo, new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 }));
    knobCap.position.y = 0.285;
    this.gearShifterGroup.add(knobCap);

    cockpitGroup.add(this.gearShifterGroup);

    // 8. Realistic 3D Foot Pedals (Clutch, Brake, Accelerator)
    const createRealisticPedal = (width: number, height: number, accentHex: number) => {
      const pGroup = new THREE.Group();

      const armGeo = new THREE.BoxGeometry(0.02, 0.2, 0.02);
      const arm = new THREE.Mesh(armGeo, darkTrimMat);
      arm.position.set(0, 0.08, 0.03);
      arm.rotation.x = -0.35;
      pGroup.add(arm);

      const plateGeo = new THREE.BoxGeometry(width, height, 0.018);
      const plateMat = new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        metalness: 0.9,
        roughness: 0.15,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.rotation.x = -0.3;
      pGroup.add(plate);

      const stripMat = new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.9 });
      for (let i = -1; i <= 1; i++) {
        const stripGeo = new THREE.BoxGeometry(width * 0.8, 0.014, 0.022);
        const strip = new THREE.Mesh(stripGeo, stripMat);
        strip.position.set(0, i * (height * 0.28), -0.004);
        strip.rotation.x = -0.3;
        pGroup.add(strip);
      }

      return pGroup;
    };

    this.clutchPedalGroup = createRealisticPedal(0.07, 0.13, 0x2563eb);
    this.clutchPedalGroup.position.set(0.14, -0.32, 0.28);
    cockpitGroup.add(this.clutchPedalGroup);

    this.brakePedalGroup = createRealisticPedal(0.09, 0.12, 0xdc2626);
    this.brakePedalGroup.position.set(0.0, -0.32, 0.28);
    cockpitGroup.add(this.brakePedalGroup);

    this.accelPedalGroup = createRealisticPedal(0.06, 0.16, 0x16a34a);
    this.accelPedalGroup.position.set(-0.14, -0.33, 0.3);
    cockpitGroup.add(this.accelPedalGroup);

    // 9. Windshield Wipers
    const wiperGeo = new THREE.BoxGeometry(0.015, 0.42, 0.012);
    const wiperMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    this.wiperLeft = new THREE.Mesh(wiperGeo, wiperMat);
    this.wiperLeft.position.set(0.15, 0.24, 0.56);
    cockpitGroup.add(this.wiperLeft);

    this.wiperRight = new THREE.Mesh(wiperGeo, wiperMat);
    this.wiperRight.position.set(-0.35, 0.24, 0.56);
    cockpitGroup.add(this.wiperRight);

    this.group.add(cockpitGroup);
  }

  public setMirrorTextures(
    centerTex: THREE.Texture,
    leftTex: THREE.Texture,
    rightTex: THREE.Texture
  ) {
    this.rearMirrorGlassMat.map = centerTex;
    this.rearMirrorGlassMat.needsUpdate = true;

    this.leftMirrorGlassMat.map = leftTex;
    this.leftMirrorGlassMat.needsUpdate = true;

    this.rightMirrorGlassMat.map = rightTex;
    this.rightMirrorGlassMat.needsUpdate = true;
  }

  public updateCockpit(
    steeringAngleRad: number,
    speedKmH: number,
    rpm: number,
    clutchVal: number,
    brakeVal: number,
    accelVal: number,
    gear: number,
    wipersOn: boolean,
    delta: number
  ) {
    this.steeringWheelGroup.rotation.z = steeringAngleRad * 2.5;

    const wheelRot = (speedKmH / 10) * delta;
    this.frontLeftWheel.rotation.x += wheelRot;
    this.frontRightWheel.rotation.x += wheelRot;
    this.rearLeftWheel.rotation.x += wheelRot;
    this.rearRightWheel.rotation.x += wheelRot;

    this.frontLeftWheel.rotation.y = -steeringAngleRad;
    this.frontRightWheel.rotation.y = -steeringAngleRad;

    const maxSpeed = this.config.topSpeedKmH;
    const speedPct = Math.min(1, speedKmH / maxSpeed);
    this.speedNeedle.rotation.z = 2.2 - speedPct * 4.4;

    const rpmPct = Math.min(1, rpm / this.config.redlineRpm);
    this.rpmNeedle.rotation.z = 2.2 - rpmPct * 4.4;

    this.clutchPedalGroup.position.z = 0.28 + clutchVal * 0.06;
    this.clutchPedalGroup.rotation.x = clutchVal * 0.35;

    this.brakePedalGroup.position.z = 0.28 + brakeVal * 0.05;
    this.brakePedalGroup.rotation.x = brakeVal * 0.32;

    this.accelPedalGroup.position.z = 0.3 + accelVal * 0.06;
    this.accelPedalGroup.rotation.x = accelVal * 0.38;

    let targetRotX = 0;
    let targetRotZ = 0;

    if (gear === 1) {
      targetRotZ = -0.25;
      targetRotX = 0.25;
    } else if (gear === 2) {
      targetRotZ = -0.25;
      targetRotX = -0.25;
    } else if (gear === 3) {
      targetRotZ = 0.0;
      targetRotX = 0.25;
    } else if (gear === 4) {
      targetRotZ = 0.0;
      targetRotX = -0.25;
    } else if (gear === 5) {
      targetRotZ = 0.25;
      targetRotX = 0.25;
    } else if (gear >= 6) {
      targetRotZ = 0.25;
      targetRotX = -0.25;
    } else if (gear === -1) {
      targetRotZ = 0.32;
      targetRotX = -0.3;
    }

    this.gearShifterGroup.rotation.x = THREE.MathUtils.lerp(this.gearShifterGroup.rotation.x, targetRotX, 0.2);
    this.gearShifterGroup.rotation.z = THREE.MathUtils.lerp(this.gearShifterGroup.rotation.z, targetRotZ, 0.2);

    if (wipersOn) {
      const time = Date.now() * 0.005;
      const sweepAngle = Math.sin(time) * 0.85;
      this.wiperLeft.rotation.z = sweepAngle;
      this.wiperRight.rotation.z = sweepAngle;
    } else {
      this.wiperLeft.rotation.z = -1.25;
      this.wiperRight.rotation.z = -1.25;
    }
  }

  public setHeadlights(active: boolean, highBeam: boolean) {
    const intensity = active ? (highBeam ? 4.5 : 2.5) : 0;
    this.headLightLeft.intensity = intensity;
    this.headLightRight.intensity = intensity;
    this.headLensLeftMat.color.setHex(active ? 0xfffbe1 : 0x334155);
    this.headLensRightMat.color.setHex(active ? 0xfffbe1 : 0x334155);
  }

  public setBrakeLights(active: boolean) {
    const color = active ? 0xff0000 : 0x991b1b;
    this.tailLightBarMat.color.setHex(color);
  }
}
