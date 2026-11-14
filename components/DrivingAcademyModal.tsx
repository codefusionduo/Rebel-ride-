'use client';

import React from 'react';
import { DrivingMission, DriverStats } from '@/lib/missions';
import { Trophy, CheckCircle, Lock, Target, Award, ArrowRight, X } from 'lucide-react';

interface DrivingAcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  missions: DrivingMission[];
  stats: DriverStats;
  onSelectMission: (m: DrivingMission) => void;
}

export const DrivingAcademyModal: React.FC<DrivingAcademyModalProps> = ({
  isOpen,
  onClose,
  missions,
  stats,
  onSelectMission,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Driving Academy & Missions</h2>
              <p className="text-xs text-slate-400">Master manual clutch driving and city traffic rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/80 border-b border-slate-800/80 text-center">
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Driver Level</div>
            <div className="text-xl font-bold text-amber-400 mt-0.5">Level {stats.level}</div>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Total XP</div>
            <div className="text-xl font-bold text-blue-400 mt-0.5">{stats.xp} XP</div>
          </div>
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Distance Driven</div>
            <div className="text-xl font-bold text-emerald-400 mt-0.5">
              {(stats.totalDistanceMeters / 1000).toFixed(1)} km
            </div>
          </div>
        </div>

        {/* Missions List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {missions.map((mission, idx) => (
            <div
              key={mission.id}
              className={`p-4 rounded-xl border transition-all ${
                mission.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                      mission.isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mission.isCompleted ? <CheckCircle className="w-5 h-5" /> : <Target className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">{mission.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        +{mission.xpReward} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{mission.description}</p>
                    <div className="text-xs text-blue-400 font-semibold mt-2 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>Objective: {mission.targetObjective}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectMission(mission);
                    onClose();
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    mission.isCompleted
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                  }`}
                >
                  {mission.isCompleted ? 'Replay' : 'Start Task'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
