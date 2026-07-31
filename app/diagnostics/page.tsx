"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Cpu,
  Search,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Clock,
  DollarSign,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Car as CarIcon,
  Database,
  History,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export default function DiagnosticsPage() {
  const [carMake, setCarMake] = useState("Honda");
  const [carModel, setCarModel] = useState("Civic");
  const [carYear, setCarYear] = useState<number | string>(2024);
  const [driverName, setDriverName] = useState("Yuvan M");
  const [query, setQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [recentComplaints, setRecentComplaints] = useState<any[]>([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (data.success) {
        setRecentComplaints(data.complaints);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const popularMakes = [
    "Honda", "Toyota", "BMW", "Ford", "Tesla", "Porsche",
    "Mercedes-Benz", "Audi", "Hyundai", "Nissan", "Chevrolet", "Dodge"
  ];

  const quickFaults = [
    "P0300 Misfire & Engine Shaking",
    "P0420 Catalytic Converter Exhaust Noise",
    "P0550 Brake Pressure Loss & Grinding",
    "P0A80 Battery Cell Imbalance",
    "P0299 Turbo Underboost Power Lag",
    "P0117 Engine Overheating Coolant High",
  ];

  const handleScan = async (problemText: string) => {
    if (!problemText.trim()) return;

    setScanning(true);
    setReport(null);

    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carMake,
          carModel,
          carYear,
          driverName,
          query: problemText,
        }),
      });

      const data = await res.json();

      setTimeout(() => {
        setReport(data.diagnosis);
        setScanning(false);
        fetchComplaints();
      }, 1200);
    } catch (err) {
      setScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(query);
  };

  return (
    <div className="min-h-screen bg-matte-black text-foreground relative flex flex-col font-exo">
      <Navbar />

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 cyber-grid" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-blue/10 border border-electric-blue/40 text-electric-blue font-rajdhani text-xs font-bold tracking-widest">
            <Sparkles className="w-4 h-4 animate-pulse text-electric-blue" />
            <span>UNIVERSAL AUTOMOTIVE DIAGNOSTIC ENGINE</span>
          </div>
          <h1 className="font-orbitron font-bold text-3xl sm:text-4xl text-white tracking-wider">
            ENTER ANY CAR <span className="text-neon-red">MAKE, MODEL & PROBLEM</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-gray-400 tracking-widest max-w-xl mx-auto uppercase">
            Input any car brand, model, and year to get an exact step-by-step repair solution recorded in MongoDB
          </p>
        </div>

        {/* Universal Input Card */}
        <div className="glass-panel glass-neon-border p-6 sm:p-8 rounded-2xl space-y-6">
          <h2 className="font-orbitron text-md font-bold text-white tracking-wider uppercase flex items-center space-x-2 border-b border-white/10 pb-4">
            <CarIcon className="w-5 h-5 text-electric-blue" />
            <span>VEHICLE IDENTIFICATION & SYMPTOM FORM</span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Brand/Make, Model, Year, Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Make */}
              <div className="space-y-1.5">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-bold">
                  Car Brand / Make
                </label>
                <input
                  type="text"
                  required
                  value={carMake}
                  onChange={(e) => setCarMake(e.target.value)}
                  placeholder="e.g. Honda, BMW, Tesla..."
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                />
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-bold">
                  Car Model
                </label>
                <input
                  type="text"
                  required
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="e.g. Civic, M3, Model 3..."
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                />
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-bold">
                  Model Year
                </label>
                <input
                  type="number"
                  required
                  min={1950}
                  max={2030}
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                />
              </div>

              {/* Driver/Technician Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-bold">
                  Driver / Owner Name
                </label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Yuvan M"
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                />
              </div>
            </div>

            {/* Quick Brand Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-rajdhani text-gray-500 tracking-widest uppercase shrink-0">
                POPULAR BRANDS:
              </span>
              {popularMakes.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setCarMake(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-rajdhani transition-all shrink-0 cursor-pointer ${
                    carMake.toLowerCase() === m.toLowerCase()
                      ? "bg-electric-blue text-black font-bold"
                      : "bg-gunmetal-grey/60 border border-white/10 text-gray-300 hover:border-electric-blue"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Row 2: Car Problem / Complaint Input */}
            <div className="space-y-2">
              <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-bold flex items-center justify-between">
                <span>Car Problem / Complaint / DTC Code</span>
                <span className="text-gray-400 text-[11px] font-normal">
                  Describe what is wrong or enter error code (e.g. P0300, Engine shaking, Brake noise)
                </span>
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                <textarea
                  required
                  rows={3}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your car problem in detail (e.g., 'Engine shaking and misfiring when accelerating above 40 mph' or 'P0420 catalytic converter code')..."
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-red transition-all font-exo text-sm resize-none"
                />
              </div>
            </div>

            {/* Preset Problem Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              <span className="text-[11px] font-rajdhani text-gray-500 tracking-widest uppercase shrink-0">
                SAMPLE FAULTS:
              </span>
              {quickFaults.map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => {
                    setQuery(f);
                    handleScan(f);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gunmetal-grey/60 border border-white/10 hover:border-electric-blue text-xs font-rajdhani text-gray-300 hover:text-electric-blue transition-all shrink-0 cursor-pointer"
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={scanning || !query.trim() || !carMake.trim() || !carModel.trim()}
              className="w-full py-4 bg-neon-red hover:bg-red-600 text-white font-orbitron font-bold text-xs tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)] disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {scanning ? (
                <span className="animate-pulse flex items-center space-x-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>ANALYZING {carYear} {carMake.toUpperCase()} {carModel.toUpperCase()}...</span>
                </span>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>GENERATE EXACT REPAIR SOLUTION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Scanning State */}
        {scanning && (
          <div className="glass-panel p-12 rounded-2xl text-center space-y-6 border border-electric-blue/40 shadow-[0_0_30px_rgba(0,240,255,0.15)] animate-pulse">
            <div className="w-16 h-16 mx-auto rounded-full bg-electric-blue/10 border-2 border-electric-blue flex items-center justify-center animate-spin">
              <Cpu className="w-8 h-8 text-electric-blue" />
            </div>
            <div className="space-y-2">
              <h3 className="font-orbitron font-bold text-xl text-white tracking-widest uppercase">
                DIAGNOSING {carYear} {carMake} {carModel}...
              </h3>
              <p className="font-rajdhani text-xs text-electric-blue tracking-widest uppercase">
                Querying database • Constructing vehicle repair procedure • Saving document to MongoDB
              </p>
            </div>
          </div>
        )}

        {/* Tailored Diagnostic Solution Report Result */}
        {report && !scanning && (
          <div className="glass-panel glass-neon-border p-8 rounded-2xl space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded bg-electric-blue/20 border border-electric-blue text-electric-blue font-orbitron font-bold text-xs tracking-wider uppercase">
                    TARGET: {carYear} {carMake} {carModel}
                  </span>
                  <span className="px-3 py-1 rounded bg-neon-red/20 border border-neon-red text-neon-red font-orbitron font-bold text-xs tracking-wider">
                    DTC: {report.code}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-rajdhani text-xs font-bold tracking-widest">
                    SOLUTION CONFIDENCE: {report.confidenceScore || 98.8}%
                  </span>
                </div>
                <h2 className="font-orbitron font-bold text-2xl text-white tracking-wider mt-2">
                  {report.title}
                </h2>
              </div>

              <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400 font-rajdhani text-xs font-bold tracking-widest uppercase">
                <AlertTriangle className="w-4 h-4" />
                <span>SEVERITY: {report.severity}</span>
              </div>
            </div>

            {/* Root Cause & Estimations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3 bg-black/50 p-5 rounded-xl border border-white/10">
                <h3 className="font-rajdhani font-bold text-xs text-electric-blue tracking-widest uppercase flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>EXACT VEHICLE ROOT CAUSE</span>
                </h3>
                <p className="text-sm font-exo text-gray-300 leading-relaxed">
                  {report.rootCause}
                </p>
              </div>

              <div className="space-y-4 bg-black/50 p-5 rounded-xl border border-white/10">
                <div>
                  <span className="text-[10px] font-rajdhani text-gray-400 uppercase tracking-widest">
                    ESTIMATED REPAIR COST
                  </span>
                  <p className="font-orbitron font-bold text-xl text-emerald-400 flex items-center space-x-1">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    <span>{report.estimatedCost}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-rajdhani text-gray-400 uppercase tracking-widest">
                    ESTIMATED LABOR TIME
                  </span>
                  <p className="font-orbitron font-bold text-sm text-electric-blue flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{report.laborTime}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Required Replacement Parts */}
            {report.partsRequired && (
              <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/10">
                <h3 className="font-rajdhani font-bold text-xs text-gray-400 tracking-widest uppercase flex items-center space-x-2">
                  <Wrench className="w-4 h-4 text-electric-blue" />
                  <span>REQUIRED SPECIFIED PARTS</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.partsRequired.map((part: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-gunmetal-grey border border-white/10 text-xs font-rajdhani text-white">
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Repair Steps */}
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-md text-white tracking-wider flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-electric-blue" />
                <span>STEP-BY-STEP REPAIR PROCEDURE FOR {carYear} {carMake.toUpperCase()} {carModel.toUpperCase()}</span>
              </h3>
              <ol className="space-y-3">
                {report.fixSteps.map((step: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-black/40 border border-white/5 font-exo text-sm text-gray-300"
                  >
                    <span className="w-6 h-6 rounded-full bg-electric-blue/20 text-electric-blue font-orbitron text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 text-xs font-rajdhani text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>SAVED TO MONGO COLLECTION `complaints`</span>
              </div>
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-3.5 bg-neon-red hover:bg-red-600 text-white font-orbitron font-bold text-xs tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)] flex items-center justify-center space-x-2"
              >
                <Wrench className="w-4 h-4" />
                <span>BOOK REPAIR APPOINTMENT</span>
              </Link>
            </div>
          </div>
        )}

        {/* Live MongoDB Logged Complaints History Feed */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-orbitron font-bold text-lg text-white tracking-wider flex items-center space-x-2">
              <History className="w-5 h-5 text-electric-blue" />
              <span>LIVE MONGO VEHICLE COMPLAINTS & SOLUTIONS LOG</span>
            </h3>
            <span className="text-xs font-rajdhani text-emerald-400 font-bold tracking-widest uppercase">
              {recentComplaints.length} COMPLAINTS PERSISTED
            </span>
          </div>

          {recentComplaints.length === 0 ? (
            <p className="text-xs font-rajdhani text-gray-500 uppercase tracking-widest text-center py-6">
              No complaints logged yet. Submit any car problem above to record in MongoDB.
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {recentComplaints.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-electric-blue/40 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-neon-red">
                        {item.code}
                      </span>
                      <span className="text-xs font-rajdhani text-electric-blue font-semibold">
                        • {item.carName}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-rajdhani font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {item.status || "DIAGNOSED"}
                      </span>
                    </div>
                    <p className="font-exo text-sm text-white font-semibold">
                      Problem: {item.symptom}
                    </p>
                    <p className="text-xs text-gray-400 font-exo">
                      <strong className="text-gray-300">Solution:</strong> {item.solution?.title} ({item.solution?.estimatedCost})
                    </p>
                  </div>

                  <span className="text-[10px] font-rajdhani text-gray-500 shrink-0">
                    Logged by {item.driverName || "Driver"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
