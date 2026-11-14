'use client';

import React, { useState, useMemo } from 'react';
import { DrivingMission } from '@/lib/missions';
import { Compass, MapPin } from 'lucide-react';

interface CircularMiniMapProps {
  carX: number;
  carZ: number;
  carHeadingRad: number;
  missions: DrivingMission[];
  activeMissionId?: string | null;
  onSelectMissionClick?: () => void;
}

const ROAD_COORDS = [-180, -60, 60, 180];
const RADAR_WORLD_RADIUS = 190;
const SVG_SIZE = 160;
const SVG_CENTER = SVG_SIZE / 2;
const SCALE = (SVG_SIZE / 2 - 12) / RADAR_WORLD_RADIUS;

export const CircularMiniMap: React.FC<CircularMiniMapProps> = ({
  carX,
  carZ,
  carHeadingRad,
  missions,
  activeMissionId,
  onSelectMissionClick,
}) => {
  const [isHeadingUp, setIsHeadingUp] = useState(true);

  const { targetMission, distanceMeters } = useMemo(() => {
    const uncompleted = missions.filter((m) => !m.isCompleted);
    const pool = uncompleted.length > 0 ? uncompleted : missions;

    if (activeMissionId) {
      const explicit = missions.find((m) => m.id === activeMissionId);
      if (explicit) {
        const d = Math.hypot(explicit.waypoint.x - carX, explicit.waypoint.z - carZ);
        return { targetMission: explicit, distanceMeters: Math.round(d) };
      }
    }

    let nearest = pool[0];
    let minDist = Infinity;
    for (const m of pool) {
      const d = Math.hypot(m.waypoint.x - carX, m.waypoint.z - carZ);
      if (d < minDist) {
        minDist = d;
        nearest = m;
      }
    }
    return {
      targetMission: nearest,
      distanceMeters: Math.round(minDist),
    };
  }, [carX, carZ, missions, activeMissionId]);

  const worldToMapRel = (wx: number, wz: number) => {
    const dx = -(wx - carX) * SCALE;
    const dy = -(wz - carZ) * SCALE;
    return {
      x: SVG_CENTER + dx,
      y: SVG_CENTER + dy,
      dx,
      dy,
    };
  };

  const mapRotationDeg = isHeadingUp ? (carHeadingRad * 180) / Math.PI : 0;
  const carIconRotationDeg = isHeadingUp ? 0 : -(carHeadingRad * 180) / Math.PI;

  const targetRel = targetMission
    ? worldToMapRel(targetMission.waypoint.x, targetMission.waypoint.z)
    : null;

  const maxPinRadius = SVG_CENTER - 14;
  const targetPinPos = useMemo(() => {
    if (!targetRel) return null;
    const distPx = Math.hypot(targetRel.dx, targetRel.dy);
    if (distPx <= maxPinRadius) {
      return { x: targetRel.x, y: targetRel.y, isClamped: false };
    }
    const ratio = maxPinRadius / distPx;
    return {
      x: SVG_CENTER + targetRel.dx * ratio,
      y: SVG_CENTER + targetRel.dy * ratio,
      isClamped: true,
    };
  }, [targetRel, maxPinRadius]);

  const northAngleRad = isHeadingUp ? carHeadingRad - Math.PI / 2 : -Math.PI / 2;
  const compassRadius = SVG_CENTER - 6;
  const northBadgeX = SVG_CENTER + Math.cos(northAngleRad) * compassRadius;
  const northBadgeY = SVG_CENTER + Math.sin(northAngleRad) * compassRadius;

  // Compute dynamic infinite street grid coordinates around player's current position
  const baseCellX = Math.round(carX / 120);
  const baseCellZ = Math.round(carZ / 120);
  const dynamicRoadX = [-2, -1, 0, 1, 2].map((d) => (baseCellX + d) * 120);
  const dynamicRoadZ = [-2, -1, 0, 1, 2].map((d) => (baseCellZ + d) * 120);
  const parkingBayPos = worldToMapRel(6.5, 165);

  return (
    <div className="flex items-center xl:flex-col gap-1.5 xl:gap-1 select-none pointer-events-auto">
      {/* Circular Mini-Map Bezel — compact on phone/landscape (w-16 h-16), full size on large desktop (xl:w-32 xl:h-32) */}
      <div
        onClick={() => setIsHeadingUp(!isHeadingUp)}
        title="Tap to toggle Heading-Up / North-Up radar mode"
        className="relative w-16 h-16 xl:w-32 xl:h-32 rounded-full bg-slate-950/90 border-2 border-slate-700/90 shadow-2xl overflow-hidden cursor-pointer group hover:border-blue-500/70 transition-colors shrink-0"
      >
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="w-full h-full">
          <defs>
            <clipPath id="minimap-circle-clip">
              <circle cx={SVG_CENTER} cy={SVG_CENTER} r={SVG_CENTER - 2} />
            </clipPath>
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#020617" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="1" />
            </radialGradient>
          </defs>

          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={SVG_CENTER - 2}
            fill="url(#radar-glow)"
          />

          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={SVG_CENTER * 0.38}
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 3"
          />
          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={SVG_CENTER * 0.72}
            fill="none"
            stroke="#1e293b"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          <g
            clipPath="url(#minimap-circle-clip)"
            transform={`rotate(${mapRotationDeg} ${SVG_CENTER} ${SVG_CENTER})`}
          >
            {/* Infinite North-South Avenues & Express Highways */}
            {dynamicRoadX.map((rx) => {
              const pTop = worldToMapRel(rx, carZ + 320);
              const pBot = worldToMapRel(rx, carZ - 320);
              const isHwy = Math.abs(Math.round(rx / 120)) % 2 === 1;
              return (
                <g key={`ns-${rx}`}>
                  <line
                    x1={pTop.x}
                    y1={pTop.y}
                    x2={pBot.x}
                    y2={pBot.y}
                    stroke={isHwy ? '#065f46' : '#334155'}
                    strokeWidth={Math.max(isHwy ? 6.5 : 4.5, (isHwy ? 22 : 18) * SCALE)}
                    strokeLinecap="round"
                  />
                  <line
                    x1={pTop.x}
                    y1={pTop.y}
                    x2={pBot.x}
                    y2={pBot.y}
                    stroke={isHwy ? '#34d399' : '#eab308'}
                    strokeWidth={isHwy ? '1.2' : '0.7'}
                    strokeDasharray="3 3"
                    strokeOpacity="0.85"
                  />
                </g>
              );
            })}

            {/* Infinite East-West Streets & Express Highways */}
            {dynamicRoadZ.map((rz) => {
              const pLeft = worldToMapRel(carX + 320, rz);
              const pRight = worldToMapRel(carX - 320, rz);
              const isHwy = Math.abs(Math.round(rz / 120)) % 2 === 1;
              return (
                <g key={`ew-${rz}`}>
                  <line
                    x1={pLeft.x}
                    y1={pLeft.y}
                    x2={pRight.x}
                    y2={pRight.y}
                    stroke={isHwy ? '#065f46' : '#334155'}
                    strokeWidth={Math.max(isHwy ? 6.5 : 4.5, (isHwy ? 22 : 18) * SCALE)}
                    strokeLinecap="round"
                  />
                  <line
                    x1={pLeft.x}
                    y1={pLeft.y}
                    x2={pRight.x}
                    y2={pRight.y}
                    stroke={isHwy ? '#34d399' : '#eab308'}
                    strokeWidth={isHwy ? '1.2' : '0.7'}
                    strokeDasharray="3 3"
                    strokeOpacity="0.85"
                  />
                </g>
              );
            })}

            {/* Yellow Parking Bay Indicator */}
            <rect
              x={parkingBayPos.x - 3}
              y={parkingBayPos.y - 4}
              width={6}
              height={8}
              fill="#eab308"
              fillOpacity="0.35"
              stroke="#facc15"
              strokeWidth="1"
            />

            {/* Grand Embassy Landmark Indicator at (60, 60) */}
            {(() => {
              const embPos = worldToMapRel(60, 60);
              return (
                <g transform={`translate(${embPos.x}, ${embPos.y})`}>
                  <rect
                    x={-8}
                    y={-8}
                    width={16}
                    height={16}
                    rx={3}
                    fill="#1e3a8a"
                    fillOpacity="0.75"
                    stroke="#f59e0b"
                    strokeWidth="1.2"
                  />
                  <circle r={3} fill="#f59e0b" />
                </g>
              );
            })()}

            {/* Secondary Mission Waypoint Dots */}
            {missions.map((m) => {
              if (targetMission && m.id === targetMission.id) return null;
              const pos = worldToMapRel(m.waypoint.x, m.waypoint.z);
              return (
                <circle
                  key={m.id}
                  cx={pos.x}
                  cy={pos.y}
                  r={2.8}
                  fill={m.isCompleted ? '#10b981' : '#64748b'}
                  stroke="#020617"
                  strokeWidth="1"
                />
              );
            })}

            {/* Dashed GPS Route Line */}
            {targetPinPos && (
              <line
                x1={SVG_CENTER}
                y1={SVG_CENTER}
                x2={targetPinPos.x}
                y2={targetPinPos.y}
                stroke="#f59e0b"
                strokeWidth="1.75"
                strokeDasharray="4 3"
              />
            )}

            {/* Active / Nearest Mission Waypoint Marker */}
            {targetPinPos && (
              <g transform={`translate(${targetPinPos.x}, ${targetPinPos.y})`}>
                <circle
                  r={targetPinPos.isClamped ? 6 : 7}
                  fill="#f59e0b"
                  fillOpacity="0.25"
                />
                <circle
                  r={4.2}
                  fill="#f59e0b"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </g>
            )}
          </g>

          {/* Player Car Vision Cone & Directional Arrow at Center */}
          <g transform={`translate(${SVG_CENTER}, ${SVG_CENTER}) rotate(${carIconRotationDeg})`}>
            <path
              d="M 0 0 L -14 -34 A 36 36 0 0 1 14 -34 Z"
              fill="#38bdf8"
              fillOpacity="0.16"
            />
            <polygon
              points="0,-8 6,6 0,3 -6,6"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </g>

          <circle
            cx={SVG_CENTER}
            cy={SVG_CENTER}
            r={SVG_CENTER - 2}
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />

          <g transform={`translate(${northBadgeX}, ${northBadgeY})`}>
            <circle r="7.5" fill="#0f172a" stroke="#ef4444" strokeWidth="1.2" />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#f87171"
              fontSize="8.5"
              fontWeight="900"
              fontFamily="monospace"
            >
              N
            </text>
          </g>
        </svg>

        <div className="hidden xl:flex absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-slate-800 px-2 py-0.5 rounded text-[9px] font-bold text-slate-300 items-center gap-1 pointer-events-none">
          <Compass className="w-2.5 h-2.5 text-blue-400" />
          <span>{isHeadingUp ? 'HEADING' : 'NORTH'}</span>
        </div>
      </div>

      {/* Nearest Mission Waypoint Info Pill */}
      {targetMission && (
        <button
          onClick={onSelectMissionClick}
          className="bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 px-2 py-1 rounded-lg xl:rounded-xl shadow-lg flex items-center gap-1 transition-colors max-w-[110px] xl:max-w-[170px]"
          title="Tap to view missions"
        >
          <MapPin className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-amber-400 shrink-0" />
          <div className="text-left truncate">
            <div className="text-[8px] xl:text-[10px] font-bold text-amber-300 leading-tight truncate">
              {targetMission.waypoint.label}
            </div>
            <div className="text-[8px] xl:text-[10px] font-mono text-slate-300 leading-tight tabular-nums">
              {distanceMeters}m
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
