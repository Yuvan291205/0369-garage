"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TelemetryGauge from "@/components/TelemetryGauge";
import {
  Car,
  Activity,
  Cpu,
  Wrench,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Fuel,
  Thermometer,
  Gauge,
  Radio,
  Database,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [activeComplaintCount, setActiveComplaintCount] = useState(0);
  const [telemetry, setTelemetry] = useState({
    speed: 142,
    rpm: 6400,
    battery: 98,
    oilTemp: 92,
    turboBoost: 1.8,
  });

  useEffect(() => {
    fetchCars();
    fetchComplaints();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch("/api/cars");
      const data = await res.json();
      if (data.success && data.cars.length > 0) {
        setVehicles(data.cars);
        setSelectedVehicleId(data.cars[0].carId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (data.success) {
        setActiveComplaintCount(data.count);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Telemetry simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        speed: Math.floor(138 + Math.random() * 8),
        rpm: Math.floor(6200 + Math.random() * 400),
        oilTemp: Math.floor(91 + Math.random() * 3),
        turboBoost: parseFloat((1.7 + Math.random() * 0.2).toFixed(2)),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentVeh =
    vehicles.find((v) => v.carId === selectedVehicleId) ||
    vehicles[0] || {
      name: "0369 CYBER ROADSTER",
      type: "Quad-Motor Electric Hypercar",
      power: "1,400 HP",
      vin: "0369-EV-9941-X",
      status: "OPTIMAL",
    };

  return (
    <div className="min-h-screen bg-matte-black text-foreground relative flex flex-col font-exo">
      <Navbar />

      {/* Background Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 cyber-grid" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Top Hero Banner / Vehicle Selector */}
        <div className="glass-panel glass-neon-border p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-gunmetal-grey border border-electric-blue/50 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Car className="w-8 h-8 text-electric-blue" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="font-orbitron font-bold text-2xl text-white tracking-wider">
                  {currentVeh.name}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-rajdhani font-bold border ${
                    currentVeh.status === "OPTIMAL"
                      ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                      : "border-amber-500/40 text-amber-400 bg-amber-500/10"
                  }`}
                >
                  {currentVeh.status || "OPTIMAL"}
                </span>
              </div>
              <p className="text-xs font-rajdhani text-gray-400 tracking-widest uppercase mt-1">
                {currentVeh.type} • VIN: {currentVeh.vin} • POWER: {currentVeh.power}
              </p>
            </div>
          </div>

          {/* Vehicle Selector Tabs from MongoDB */}
          <div className="flex items-center space-x-2 bg-black/60 p-1.5 rounded-xl border border-white/10 w-full md:w-auto overflow-x-auto">
            {vehicles.map((v) => (
              <button
                key={v.carId}
                onClick={() => setSelectedVehicleId(v.carId)}
                className={`px-3 py-1.5 rounded-lg text-xs font-rajdhani font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedVehicleId === v.carId
                    ? "bg-neon-red text-white shadow-[0_0_12px_rgba(255,0,60,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {v.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Live Telemetry Gauges Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wider flex items-center space-x-2">
              <Radio className="w-5 h-5 text-electric-blue animate-pulse" />
              <span>LIVE TELEMETRY STREAM</span>
            </h2>
            <span className="text-xs font-rajdhani text-gray-400 tracking-widest uppercase">
              FEED SYNCED @ 60 FPS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TelemetryGauge
              label="VEHICLE SPEED"
              value={telemetry.speed}
              max={220}
              unit="MPH"
              color="blue"
              statusText="CRUISE"
            />
            <TelemetryGauge
              label="ENGINE TACHOMETER"
              value={telemetry.rpm}
              max={9000}
              unit="RPM"
              color="red"
              statusText="PEAK"
            />
            <TelemetryGauge
              label="HIGH-VOLT BATTERY"
              value={telemetry.battery}
              max={100}
              unit="%"
              color="emerald"
              statusText="HEALTHY"
            />
            <TelemetryGauge
              label="COOLANT TEMP"
              value={telemetry.oilTemp}
              max={130}
              unit="°C"
              color="amber"
              statusText="NOMINAL"
            />
          </div>
        </div>

        {/* Middle Section: AI Core Diagnostics & Mongo Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Diagnostics Callout Card */}
          <div className="lg:col-span-2 glass-panel glass-neon-border p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-lg bg-electric-blue/10 border border-electric-blue/40 text-electric-blue">
                    <Database className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-orbitron text-lg font-bold text-white tracking-wider">
                      MONGODB COMPLAINT ENGINE ONLINE
                    </h3>
                    <p className="text-xs font-rajdhani text-gray-400 tracking-widest">
                      Live Vehicle Database • DTC Solution Knowledgebase
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-rajdhani text-xs font-bold tracking-widest">
                  DATABASE SYNCED
                </span>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-rajdhani text-xs font-bold text-gray-300 tracking-widest uppercase flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-electric-blue" />
                    <span>ACTIVE MONGO LOGGED COMPLAINTS</span>
                  </span>
                  <span className="text-xs font-mono text-neon-red font-bold">
                    {activeComplaintCount} RECORDED
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed font-exo">
                  Live MongoDB vehicle models loaded ({vehicles.length} cars). Log new complaints to record DTC error codes and get exact step-by-step repair solutions.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Link
                  href="/diagnostics"
                  className="flex items-center justify-center space-x-2 p-3.5 rounded-xl bg-electric-blue/15 border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black font-orbitron text-xs font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  <Cpu className="w-4 h-4" />
                  <span>LOG COMPLAINT & DIAGNOSE</span>
                </Link>

                <Link
                  href="/services"
                  className="flex items-center justify-center space-x-2 p-3.5 rounded-xl bg-neon-red/15 border border-neon-red text-neon-red hover:bg-neon-red hover:text-white font-orbitron text-xs font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,60,0.2)]"
                >
                  <Wrench className="w-4 h-4" />
                  <span>SCHEDULE SERVICE</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Telemetry Summary Matrix */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-6">
            <h3 className="font-orbitron text-md font-bold text-white tracking-wider flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-neon-red" />
              <span>TIRE & BOOST MATRIX</span>
            </h3>

            {/* Tire Pressures */}
            <div className="space-y-2">
              <span className="text-xs font-rajdhani text-gray-400 uppercase tracking-widest">
                TIRE PRESSURE (PSI)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 font-rajdhani">FL</p>
                  <p className="font-orbitron font-bold text-sm text-electric-blue">34 PSI</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 font-rajdhani">FR</p>
                  <p className="font-orbitron font-bold text-sm text-electric-blue">34 PSI</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-amber-500/40 text-center">
                  <p className="text-[10px] text-amber-400 font-rajdhani">RL ⚠</p>
                  <p className="font-orbitron font-bold text-sm text-amber-400">33 PSI</p>
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/10 text-center">
                  <p className="text-[10px] text-gray-500 font-rajdhani">RR</p>
                  <p className="font-orbitron font-bold text-sm text-electric-blue">34 PSI</p>
                </div>
              </div>
            </div>

            {/* Turbo Boost & Brake Wear */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-rajdhani">
                <span className="text-gray-400 uppercase tracking-widest">TURBO BOOST</span>
                <span className="font-orbitron text-electric-blue font-bold">
                  {telemetry.turboBoost} BAR
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-rajdhani">
                <span className="text-gray-400 uppercase tracking-widest">BRAKE PAD LIFE</span>
                <span className="font-orbitron text-emerald-400 font-bold">84%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
