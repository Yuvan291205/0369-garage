"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Gauge,
  Cpu,
  Wrench,
  ShieldCheck,
  LogOut,
  Car,
  Activity,
  Menu,
  X,
  Zap,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: "DASHBOARD", href: "/dashboard", icon: Gauge },
    { name: "AI DIAGNOSTICS", href: "/diagnostics", icon: Cpu },
    { name: "SERVICES", href: "/services", icon: Wrench },
  ];

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl bg-matte-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gunmetal-grey border border-electric-blue/40 flex items-center justify-center group-hover:border-neon-red transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Car className="w-5 h-5 text-electric-blue group-hover:text-neon-red transition-colors" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className="font-orbitron font-bold text-xl text-white tracking-wider">
                0369
              </span>
              <span className="font-orbitron font-bold text-xl text-neon-red">
                GARAGE
              </span>
            </div>
            <p className="text-[9px] font-rajdhani text-gray-400 tracking-[0.2em] uppercase">
              AI Automotive Ecosystem
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-rajdhani font-semibold text-sm tracking-widest transition-all ${
                  isActive
                    ? "bg-electric-blue/10 text-electric-blue border border-electric-blue/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-electric-blue animate-pulse" : "text-gray-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status Indicators & Profile Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gunmetal-grey/60 border border-emerald-500/30 text-emerald-400 text-xs font-rajdhani tracking-widest">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>AI CORE ONLINE</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-gray-300 hover:text-white hover:bg-neon-red/20 hover:border-neon-red transition-all font-rajdhani text-xs tracking-widest"
            title="Eject / Sign Out"
          >
            <LogOut className="w-4 h-4 text-neon-red" />
            <span>EJECT</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-gray-300 hover:text-white bg-gunmetal-grey"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden glass-panel border-t border-white/10 px-4 pt-3 pb-6 space-y-3 bg-matte-black/95">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-rajdhani text-sm font-semibold tracking-widest ${
                  isActive
                    ? "bg-electric-blue/15 text-electric-blue border border-electric-blue/40"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className="w-5 h-5 text-electric-blue" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-rajdhani">
              <Zap className="w-3.5 h-3.5 animate-pulse" />
              <span>CORE ONLINE</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-neon-red/20 border border-neon-red text-white text-xs font-rajdhani"
            >
              <LogOut className="w-4 h-4" />
              <span>EJECT</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
