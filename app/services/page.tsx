"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Wrench,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sliders,
  DollarSign,
  QrCode,
  Sparkles,
} from "lucide-react";

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState("SERVICE-01");
  const [date, setDate] = useState("2026-08-05");
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [bay, setBay] = useState("BAY-03 (HYPERCAR RAMP)");
  const [bookingPass, setBookingPass] = useState<any>(null);

  const services = [
    {
      id: "SERVICE-01",
      title: "AI PERFORMANCE TUNE & ECU REMAP",
      price: "$340",
      duration: "1.5 HOURS",
      desc: "Custom high-output ECU fuel/ignition map optimization with dynamic boost calibration.",
      icon: Zap,
    },
    {
      id: "SERVICE-02",
      title: "FULL TELEMETRY & HARDWARE DIAGNOSTIC",
      price: "$190",
      duration: "1.0 HOUR",
      desc: "Comprehensive CAN-bus oscilloscope scan, brake line pressure test, and suspension inspection.",
      icon: Sliders,
    },
    {
      id: "SERVICE-03",
      title: "SOLID-STATE BATTERY BALANCING",
      price: "$280",
      duration: "2.0 HOURS",
      desc: "High-voltage individual cell state-of-charge equalization and thermal management flush.",
      icon: ShieldCheck,
    },
    {
      id: "SERVICE-04",
      title: "CYBER DETAILING & CERAMIC SHIELD",
      price: "$450",
      duration: "3.5 HOURS",
      desc: "Hydrophobic 9H nano-ceramic exterior armor coating and UV interior sterilization.",
      icon: Sparkles,
    },
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceObj = services.find((s) => s.id === selectedService) || services[0];
    setBookingPass({
      passId: `0369-PASS-${Math.floor(100000 + Math.random() * 900000)}`,
      service: serviceObj.title,
      price: serviceObj.price,
      date,
      timeSlot,
      bay,
      timestamp: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="min-h-screen bg-matte-black text-foreground relative flex flex-col font-exo">
      <Navbar />

      {/* Background Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 cyber-grid" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-neon-red/10 border border-neon-red/40 text-neon-red font-rajdhani text-xs font-bold tracking-widest">
            <Wrench className="w-4 h-4 animate-pulse" />
            <span>AUTHORIZATION BAY</span>
          </div>
          <h1 className="font-orbitron font-bold text-3xl sm:text-4xl text-white tracking-wider">
            GARAGE <span className="text-neon-red">SERVICES</span>
          </h1>
          <p className="text-xs sm:text-sm font-rajdhani text-gray-400 tracking-widest max-w-xl mx-auto uppercase">
            Schedule precision automotive maintenance with certified 0369 technicians
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Selection Grid */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-orbitron text-md font-bold text-white tracking-wider uppercase">
              SELECT SERVICE PACKAGE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((serv) => {
                const Icon = serv.icon;
                const isSelected = selectedService === serv.id;
                return (
                  <div
                    key={serv.id}
                    onClick={() => setSelectedService(serv.id)}
                    className={`glass-panel p-6 rounded-2xl cursor-pointer transition-all space-y-4 relative ${
                      isSelected
                        ? "border-neon-red shadow-[0_0_25px_rgba(255,0,60,0.3)] bg-neon-red/5"
                        : "border-white/10 hover:border-electric-blue/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-gunmetal-grey border border-white/10 text-electric-blue">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="font-orbitron font-bold text-lg text-emerald-400">
                        {serv.price}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-orbitron font-bold text-sm text-white tracking-wider">
                        {serv.title}
                      </h3>
                      <p className="text-xs font-exo text-gray-400 mt-2 leading-relaxed">
                        {serv.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-rajdhani">
                      <span className="text-gray-500 uppercase tracking-widest">DURATION</span>
                      <span className="text-electric-blue font-bold tracking-widest">
                        {serv.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Booking Scheduler Form */}
          <div className="glass-panel glass-neon-border p-6 rounded-2xl space-y-6 h-fit">
            <h2 className="font-orbitron text-md font-bold text-white tracking-wider uppercase flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-electric-blue" />
              <span>APPOINTMENT BAY</span>
            </h2>

            <form onSubmit={handleBook} className="space-y-4">
              {/* Date */}
              <div className="space-y-2">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest">
                  Target Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                  required
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                >
                  <option value="09:00 AM">09:00 AM - MORNING IGNITION</option>
                  <option value="10:00 AM">10:00 AM - PRIME SCAN</option>
                  <option value="02:00 PM">02:00 PM - AFTERNOON DYNO</option>
                  <option value="04:30 PM">04:30 PM - EVENING TUNE</option>
                </select>
              </div>

              {/* Garage Bay */}
              <div className="space-y-2">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest">
                  Assigned Bay
                </label>
                <select
                  value={bay}
                  onChange={(e) => setBay(e.target.value)}
                  className="w-full bg-black/60 border border-gunmetal-grey rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-red transition-all font-exo text-sm"
                >
                  <option value="BAY-03 (HYPERCAR RAMP)">BAY-03 (HYPERCAR RAMP)</option>
                  <option value="BAY-01 (DYNO & TUNING)">BAY-01 (DYNO & TUNING)</option>
                  <option value="BAY-05 (CERAMIC SHIELD)">BAY-05 (CERAMIC SHIELD)</option>
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-neon-red hover:bg-red-600 text-white font-orbitron font-bold text-xs tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)] cursor-pointer mt-4 flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRM APPOINTMENT</span>
              </button>
            </form>
          </div>
        </div>

        {/* Digital Booking Pass Modal Overlay */}
        {bookingPass && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel glass-neon-border p-8 rounded-2xl max-w-md w-full space-y-6 relative border border-electric-blue/50 shadow-[0_0_50px_rgba(0,240,255,0.3)]">
              {/* Header */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-orbitron font-bold text-xl text-white tracking-wider">
                  SERVICE CONFIRMED
                </h3>
                <p className="text-xs font-rajdhani text-electric-blue tracking-widest uppercase">
                  DIGITAL GARAGE PASS GENERATED
                </p>
              </div>

              {/* Ticket Details */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-3 text-xs font-rajdhani">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">PASS ID</span>
                  <span className="font-mono text-neon-red font-bold">{bookingPass.passId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">SERVICE</span>
                  <span className="font-bold text-white text-right max-w-[200px]">
                    {bookingPass.service}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">DATE & TIME</span>
                  <span className="text-electric-blue font-bold">
                    {bookingPass.date} @ {bookingPass.timeSlot}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">LOCATION</span>
                  <span className="text-gray-200 font-bold">{bookingPass.bay}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-400">FEE</span>
                  <span className="font-orbitron text-emerald-400 font-bold text-sm">
                    {bookingPass.price}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setBookingPass(null)}
                className="w-full py-3 bg-gunmetal-grey hover:bg-white/10 text-white font-orbitron font-bold text-xs tracking-widest rounded-xl transition-all border border-white/10 cursor-pointer"
              >
                CLOSE PASS
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
