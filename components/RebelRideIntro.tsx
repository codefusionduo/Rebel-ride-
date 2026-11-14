'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Gauge, Zap, ShieldCheck, Play, FastForward, Sparkles } from 'lucide-react';

export type IntroStage = 'city_drive' | 'logo_reveal' | 'driving';

interface RebelRideIntroProps {
  stage: IntroStage;
  onSkipOrStart: () => void;
  carName: string;
  carAccentColor: string;
}

/**
 * High-detail HTML5 Canvas crest for the REBEL RIDE logo reveal
 * Renders a glowing neon tachometer ring, speed trails, and sleek hypercar silhouette
 */
const RebelCrestCanvas: React.FC<{ accentColor: string }> = ({ accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Outer ambient nitro glow
    const glowGrad = ctx.createRadialGradient(cx, cy, 12, cx, cy, 110);
    glowGrad.addColorStop(0, `${accentColor}55`);
    glowGrad.addColorStop(0.55, '#f59e0b33');
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 110, 0, Math.PI * 2);
    ctx.fill();

    // Tachometer outer segmented arc
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 84, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Active redline & amber turbo arc
    const arcGrad = ctx.createLinearGradient(cx - 80, cy, cx + 80, cy);
    arcGrad.addColorStop(0, '#38bdf8');
    arcGrad.addColorStop(0.5, '#f59e0b');
    arcGrad.addColorStop(1, '#ef4444');
    ctx.strokeStyle = arcGrad;
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx, cy, 84, Math.PI * 0.75, Math.PI * 2.08);
    ctx.stroke();

    // Tick marks around the tachometer
    for (let i = 0; i <= 18; i++) {
      const angle = Math.PI * 0.75 + (i / 18) * (Math.PI * 1.5);
      const innerR = i % 3 === 0 ? 68 : 73;
      const outerR = 78;
      ctx.strokeStyle = i >= 14 ? '#ef4444' : 'rgba(226,232,240,0.65)';
      ctx.lineWidth = i % 3 === 0 ? 2.5 : 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
      ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
      ctx.stroke();
    }
    ctx.restore();

    // Dynamic speed streaks behind car silhouette
    const streakColors = ['#f59e0b', '#ef4444', '#38bdf8'];
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = streakColors[i % streakColors.length];
      ctx.globalAlpha = 0.45;
      ctx.lineWidth = 2;
      const yOff = cy - 16 + i * 7;
      ctx.beginPath();
      ctx.moveTo(cx - 65 - (i % 3) * 10, yOff);
      ctx.lineTo(cx - 18, yOff);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Sleek Rebel Sports Car Silhouette in center of crest
    ctx.save();
    const carGrad = ctx.createLinearGradient(cx - 52, cy - 18, cx + 55, cy + 16);
    carGrad.addColorStop(0, '#f8fafc');
    carGrad.addColorStop(0.5, '#f59e0b');
    carGrad.addColorStop(1, '#ef4444');
    ctx.fillStyle = carGrad;

    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 12);
    ctx.lineTo(cx - 46, cy - 1);
    ctx.lineTo(cx - 32, cy - 4);
    ctx.lineTo(cx - 10, cy - 18);
    ctx.lineTo(cx + 16, cy - 18);
    ctx.lineTo(cx + 35, cy - 5);
    ctx.lineTo(cx + 52, cy + 2);
    ctx.lineTo(cx + 49, cy + 12);
    ctx.closePath();
    ctx.fill();

    // Cockpit glass cutout
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.moveTo(cx - 25, cy - 4);
    ctx.lineTo(cx - 8, cy - 14);
    ctx.lineTo(cx + 14, cy - 14);
    ctx.lineTo(cx + 28, cy - 4);
    ctx.closePath();
    ctx.fill();

    // Front & rear glowing wheels
    [-30, 31].forEach((wx) => {
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(cx + wx, cy + 12, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(cx + wx, cy + 12, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Headlight beam
    const beamGrad = ctx.createLinearGradient(cx + 50, cy + 4, cx + 82, cy + 4);
    beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
    beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx + 48, cy + 1);
    ctx.lineTo(cx + 82, cy - 5);
    ctx.lineTo(cx + 82, cy + 11);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-[0_0_25px_rgba(245,158,11,0.5)]"
    />
  );
};

export const RebelRideIntro: React.FC<RebelRideIntroProps> = ({
  stage,
  onSkipOrStart,
  carName,
  carAccentColor,
}) => {
  return (
    <AnimatePresence>
      {stage !== 'driving' && (
        <motion.div
          key="rebel-ride-intro-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between overflow-hidden select-none"
        >
          {/* Top Cinematic Letterbox Bar */}
          <motion.div
            initial={{ y: -90 }}
            animate={{ y: 0 }}
            exit={{ y: -90 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent pt-3 pb-6 px-4 sm:px-8 flex items-center justify-between border-b border-amber-500/20"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-5" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-amber-400">
                {stage === 'city_drive'
                  ? 'LIVE 3D CITY DRIVING SHOWCASE • EMBASSY CENTRAL AVE'
                  : 'REBEL RIDE • OFFICIAL 3D DRIVING SIMULATOR'}
              </span>
            </div>

            <button
              onClick={onSkipOrStart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/80 text-[11px] font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              <span>Skip Intro</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {/* Center Stage: Phase 1 shows unobstructed 3D City Driving with sleek floating callouts; Phase 2 slams in the REBEL RIDE Logo */}
          <div className="relative flex-1 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              {stage === 'city_drive' ? (
                <motion.div
                  key="city-drive-callouts"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.45 }}
                  className="w-full max-w-4xl flex flex-col items-center justify-end h-full pb-6 pointer-events-none"
                >
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 bg-slate-950/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800/90 shadow-2xl">
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>LIVE TRAFFIC & SIGNALS</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-300">
                      <Zap className="w-4 h-4" />
                      <span>EXPRESS HIGHWAYS (180 KM/H)</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sky-400">
                      <Gauge className="w-4 h-4" />
                      <span>FEATURED CAR: {carName.toUpperCase()}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="rebel-ride-logo-centerpiece"
                  initial={{ opacity: 0, scale: 0.65, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.15 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 18,
                  }}
                  className="relative flex flex-col items-center text-center max-w-xl w-full bg-slate-950/80 backdrop-blur-xl px-6 py-6 sm:px-10 sm:py-8 rounded-3xl border border-amber-500/40 shadow-[0_0_90px_rgba(245,158,11,0.3)]"
                >
                  {/* Animated Shockwave Ring */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0.8 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-3xl border-2 border-amber-400/40 pointer-events-none"
                  />

                  {/* Rebel Ride Tachometer & Supercar Crest */}
                  <RebelCrestCanvas accentColor={carAccentColor} />

                  {/* Top Edition Tag */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-extrabold uppercase tracking-[0.25em]"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span>ULTIMATE STREET & HIGHWAY EDITION</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </motion.div>

                  {/* REBEL RIDE Main Title */}
                  <motion.h1
                    initial={{ letterSpacing: '0.25em', opacity: 0 }}
                    animate={{ letterSpacing: '0.06em', opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.45 }}
                    className="mt-2 text-4xl sm:text-6xl font-black italic uppercase tracking-wider leading-none drop-shadow-[0_6px_25px_rgba(0,0,0,0.9)]"
                  >
                    <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mr-2.5">
                      REBEL
                    </span>
                    <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      RIDE
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-2 text-xs sm:text-sm font-medium text-slate-300 max-w-md"
                  >
                    Realistic 3D City Driving • Clutch &amp; 6-Speed Gearbox • Traffic Rules &amp; Express Highways
                  </motion.p>

                  {/* Animated Loading / Ignition Bar */}
                  <div className="mt-5 w-full max-w-xs bg-slate-900/90 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <motion.div
                      initial={{ width: '15%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.8, ease: 'easeInOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-400 via-amber-400 to-red-500"
                    />
                  </div>

                  {/* Interactive Start Driving CTA */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={onSkipOrStart}
                    className="mt-5 flex items-center gap-2.5 px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>Enter Cockpit &amp; Drive</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Cinematic Letterbox Bar */}
          <motion.div
            initial={{ y: 90 }}
            animate={{ y: 0 }}
            exit={{ y: 90 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pb-3 pt-6 px-4 sm:px-8 flex items-center justify-between border-t border-amber-500/20"
          >
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                {stage === 'city_drive' ? 'STEP 1 / 2: CITY FLYOVER' : 'STEP 2 / 2: REBEL RIDE'}
              </span>
              <span className="hidden sm:inline">
                Embassy Central Ave • 5 Connected Cities • Live Rear Mirrors
              </span>
            </div>

            <div className="text-[10px] sm:text-xs font-mono font-bold text-emerald-400 animate-pulse">
              {stage === 'city_drive' ? 'CRUISING THROUGH CITY...' : 'LAUNCHING COCKPIT VIEW...'}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
