"use client";

import React from "react";

interface TelemetryGaugeProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color?: "blue" | "red" | "emerald" | "amber";
  statusText?: string;
}

export default function TelemetryGauge({
  label,
  value,
  max,
  unit,
  color = "blue",
  statusText = "OPTIMAL",
}: TelemetryGaugeProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const strokeDashoffset = 283 - (283 * percentage) / 100;

  const colorMap = {
    blue: {
      stroke: "#00f0ff",
      glow: "shadow-[0_0_15px_rgba(0,240,255,0.4)]",
      text: "text-electric-blue",
      badge: "border-electric-blue/40 text-electric-blue bg-electric-blue/10",
    },
    red: {
      stroke: "#ff003c",
      glow: "shadow-[0_0_15px_rgba(255,0,60,0.4)]",
      text: "text-neon-red",
      badge: "border-neon-red/40 text-neon-red bg-neon-red/10",
    },
    emerald: {
      stroke: "#10b981",
      glow: "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
      text: "text-emerald-400",
      badge: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    },
    amber: {
      stroke: "#f59e0b",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
      text: "text-amber-400",
      badge: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    },
  };

  const selectedColor = colorMap[color];

  return (
    <div className="glass-panel glass-neon-border p-6 rounded-2xl flex flex-col items-center justify-between relative overflow-hidden group">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="font-rajdhani text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
          {label}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold border ${selectedColor.badge}`}
        >
          {statusText}
        </span>
      </div>

      {/* Radial Gauge */}
      <div className="relative w-36 h-36 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#1a1d24"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={selectedColor.stroke}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-orbitron text-2xl font-bold ${selectedColor.text}`}>
            {value}
          </span>
          <span className="font-rajdhani text-xs text-gray-400 font-semibold tracking-widest">
            {unit}
          </span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full mt-4 bg-gunmetal-grey/60 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-1000 rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: selectedColor.stroke,
          }}
        />
      </div>
    </div>
  );
}
