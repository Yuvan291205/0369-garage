"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CanvasBackground from "@/components/CanvasBackground";
import { Lock, Mail, ShieldAlert, ArrowRight, KeyRound, Zap, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate Ignition Sequence authentication
    setTimeout(() => {
      if (email.trim() && password.trim()) {
        router.push("/dashboard");
      } else {
        setError("AUTHENTICATION FAILED: INVALID CREDENTIALS");
        setLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail("driver@0369.com");
    setPassword("ignition0369");
    setError("");
  };

  return (
    <main className="relative w-full h-screen bg-matte-black overflow-hidden flex flex-col md:block">
      {/* Generated Cinematic Supercar Assembly Visual Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <div className="relative w-full h-full">
          <img
            src="/futuristic_hypercar_assembly.png"
            alt="Cinematic Supercar Assembly"
            className="w-full h-full object-cover opacity-75 transform-gpu scale-105 transition-transform duration-10000 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60" />
        </div>
        <CanvasBackground />
      </div>

      {/* Top Left REC & Assembly Status Indicator */}
      <div className="absolute top-8 left-8 pointer-events-none z-10 flex items-center space-x-3 opacity-90">
        <div className="w-2.5 h-2.5 rounded-full bg-neon-red shadow-[0_0_12px_#ff003c] animate-pulse" />
        <div className="flex flex-col">
          <span className="font-rajdhani text-xs font-bold text-white uppercase tracking-[0.3em] flex items-center space-x-2">
            <span>SYSTEM REC // AI HYPERCAR ASSEMBLY ONLINE</span>
          </span>
          <span className="text-[10px] font-mono text-electric-blue">UNREAL V5 BLUEPRINT SYNCED</span>
        </div>
      </div>

      {/* Top Right Quick Demo Access */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={handleDemoLogin}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gunmetal-grey/80 border border-electric-blue/40 text-electric-blue hover:border-electric-blue font-rajdhani text-xs font-semibold tracking-widest transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-electric-blue" />
          <span>AUTO-FILL DEMO KEY</span>
        </button>
      </div>

      {/* Center/Right Glassmorphism Login Card */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center md:justify-end p-6 md:p-12 pointer-events-none">
        <div className="pointer-events-auto mt-12 md:mt-0 relative group max-w-md w-full">
          {/* Animated Glow Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue via-neon-red to-electric-blue rounded-2xl blur opacity-35 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />

          <div className="relative glass-panel glass-neon-border p-8 rounded-2xl backdrop-blur-2xl shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-orbitron font-bold text-white tracking-wider">
                  ACCESS <span className="text-neon-red">GARAGE</span>
                </h2>
                <div className="p-2 rounded-lg bg-electric-blue/10 border border-electric-blue/40 text-electric-blue">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <p className="text-gray-400 font-rajdhani font-semibold uppercase tracking-widest text-xs">
                Authenticate to enter AI automotive dashboard
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="p-3 rounded-lg bg-neon-red/10 border border-neon-red/50 text-neon-red flex items-center space-x-2 font-rajdhani text-xs font-semibold tracking-wider">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-semibold flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Identity</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/70 border border-gunmetal-grey rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-red transition-colors font-exo placeholder:text-gray-600 text-sm"
                  placeholder="driver@0369.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-rajdhani text-electric-blue uppercase tracking-widest font-semibold flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure Key</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/70 border border-gunmetal-grey rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-neon-red transition-colors font-exo placeholder:text-gray-600 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neon-red hover:bg-red-600 text-white font-orbitron font-bold py-4 rounded-xl tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.7)] disabled:opacity-50 flex items-center justify-center space-x-2 group/btn cursor-pointer"
              >
                {loading ? (
                  <span className="animate-pulse flex items-center space-x-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>INITIALIZING HYPERCAR ASSEMBLY...</span>
                  </span>
                ) : (
                  <>
                    <span>IGNITION SEQUENCE</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-[11px] font-rajdhani text-gray-500 uppercase tracking-widest">
                SYSTEM VER: 0369.4.2 // SECURITY PROTOCOL ACTIVE
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Right Developer Attribution */}
      <div className="absolute bottom-8 right-8 text-right pointer-events-none z-10">
        <p className="text-[10px] font-rajdhani text-gray-400 uppercase tracking-widest">
          Developed and engineered by
        </p>
        <p className="text-sm font-orbitron text-electric-blue font-bold tracking-widest drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
          YUVAN M
        </p>
      </div>
    </main>
  );
}
