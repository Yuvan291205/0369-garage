"use client";

import AIAssistant from "@/components/AIAssistant";
import CanvasBackground from "@/components/CanvasBackground";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { useGestureControl, GestureType } from "@/hooks/useGestureControl";
import { useFaceRecognition } from "@/hooks/useFaceRecognition";
import { useState, useCallback, useEffect } from "react";

export default function ScorpionControlPage() {
  const { isListening, transcript, interimTranscript, voiceError, toggleListening, speak, setTranscript } =
    useVoiceCommand();
  const [commandInput, setCommandInput] = useState("");
  const [lastAction, setLastAction] = useState<string | null>(null);

  // App Launcher Handler
  const launchApp = useCallback(
    async (appName: string) => {
      const target = appName.trim();
      if (!target) return;

      speak(`Opening ${target} now.`);
      setLastAction(`🚀 Voice Command Executed: Launching ${target}...`);

      try {
        const res = await fetch("/api/launch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appName: target }),
        });
        const data = await res.json();

        if (data.success && data.url) {
          window.open(data.url, "_blank");
          setLastAction(`🚀 Opened ${data.target} (${data.url})`);
        } else if (data.success) {
          setLastAction(`🚀 Launched desktop app ${data.target}`);
        } else {
          setLastAction(`❌ Could not launch ${target}`);
        }
      } catch {
        setLastAction(`❌ Failed to launch ${target}`);
      }
    },
    [speak]
  );

  // Hand Gesture Control Handler
  const handleGesture = useCallback(
    (gesture: GestureType) => {
      if (gesture === "open_palm") {
        toggleListening();
        setLastAction("✋ Open Palm Gesture → Mic Toggled");
      } else if (gesture === "thumbs_up") {
        setLastAction("👍 Thumbs Up Gesture → Opening YouTube");
        launchApp("youtube");
      } else if (gesture === "victory") {
        setLastAction("✌️ Victory V-Sign → Opening Google");
        launchApp("google");
      } else if (gesture === "closed_fist") {
        setLastAction("✊ Closed Fist → Launching Calculator");
        launchApp("calculator");
      }
    },
    [toggleListening, launchApp]
  );

  const {
    isActive: gestureActive,
    isLoading: gestureLoading,
    currentGesture,
    toggleGesture,
  } = useGestureControl({ onGesture: handleGesture });

  // Face Recognition Hook
  const {
    isActive: faceActive,
    isLoading: faceLoading,
    faceData,
    toggleFaceDetection,
  } = useFaceRecognition();

  // DIRECT VOICE INPUT TO APP EXECUTION: Listen to voice input & launch app immediately!
  useEffect(() => {
    if (transcript) {
      const voiceText = transcript;
      setTranscript(""); // clear transcript to prevent loop
      setLastAction(`🎙️ Voice Input Received: "${voiceText}"`);
      launchApp(voiceText);
    }
  }, [transcript, launchApp, setTranscript]);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-matte-black text-foreground overflow-hidden selection:bg-neon-red selection:text-white p-4">
      {/* Dynamic Cyber Canvas Background */}
      <CanvasBackground />
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none opacity-20" />

      {/* Header */}
      <header className="relative z-10 text-center mb-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-orbitron bg-neon-red/10 border border-neon-red/30 text-neon-red tracking-widest mb-3 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-neon-red animate-ping" />
          SCORPION CONTROL CENTER
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-red via-white to-electric-blue drop-shadow-glow-red">
          SCORPION AI
        </h1>
        <p className="mt-2 text-sm md:text-base font-rajdhani text-gray-400 tracking-wide">
          Voice Recognition • Voice Commands • Face Recognition • Hand Gestures
        </p>
      </header>

      {/* 4 Core Pillars Control Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
        {/* 1. Voice Recognition Card */}
        <div className="glass-panel glass-neon-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎙️</span>
                <h2 className="font-orbitron text-sm font-bold text-electric-blue">
                  VOICE RECOGNITION
                </h2>
              </div>
              <button
                onClick={toggleListening}
                className="text-[10px] font-mono px-3 py-1 rounded font-bold transition-all"
                style={{
                  background: isListening ? "rgba(0,240,255,0.25)" : "rgba(255,255,255,0.06)",
                  border: `1px solid ${isListening ? "rgba(0,240,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                  color: isListening ? "#00f0ff" : "rgba(255,255,255,0.6)",
                }}
              >
                {isListening ? "🔴 STOP MIC" : "🎙️ START MIC"}
              </button>
            </div>
            <p className="text-xs font-rajdhani text-gray-400 leading-relaxed mb-3">
              Click START MIC & speak any app name (e.g., "open Chrome", "YouTube", "Calculator").
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-electric-blue/30 font-mono text-xs text-electric-blue min-h-14 flex flex-col justify-center">
            {voiceError ? (
              <span className="text-red-400 font-bold">{voiceError}</span>
            ) : isListening ? (
              <span>
                {interimTranscript ? (
                  <span className="text-electric-blue/70 italic">"{interimTranscript}..."</span>
                ) : transcript ? (
                  <span className="text-electric-blue font-bold">"{transcript}"</span>
                ) : (
                  <span className="animate-pulse">🎙️ Listening... speak app command.</span>
                )}
              </span>
            ) : (
              <span className="text-gray-500">Mic offline. Click 'START MIC' to speak.</span>
            )}
          </div>
        </div>

        {/* 2. Voice Commands & App Launcher Card */}
        <div className="glass-panel glass-neon-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗣️</span>
                <h2 className="font-orbitron text-sm font-bold text-neon-red">
                  VOICE COMMANDS
                </h2>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neon-red/10 border border-neon-red/30 text-neon-red font-bold">
                SYSTEM CONTROL
              </span>
            </div>

            {/* Quick App Launch Buttons */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {["Chrome", "YouTube", "Calculator", "Notepad", "Spotify", "Google"].map((app) => (
                <button
                  key={app}
                  onClick={() => launchApp(app)}
                  className="text-[10px] font-mono px-2.5 py-1 rounded bg-black/60 border border-neon-red/30 text-gray-300 hover:text-neon-red hover:border-neon-red transition-all font-bold"
                >
                  🚀 {app}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Command Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type app to launch (e.g. Notepad)..."
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  launchApp(commandInput);
                  setCommandInput("");
                }
              }}
              className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-neon-red"
            />
            <button
              onClick={() => {
                launchApp(commandInput);
                setCommandInput("");
              }}
              className="px-3 py-1.5 rounded-lg bg-neon-red/20 border border-neon-red/40 text-neon-red font-orbitron font-bold text-xs hover:bg-neon-red/40"
            >
              LAUNCH
            </button>
          </div>
        </div>

        {/* 3. Face Recognition Card */}
        <div className="glass-panel glass-neon-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                <h2 className="font-orbitron text-sm font-bold text-amber-400">
                  FACE RECOGNITION
                </h2>
              </div>
              <button
                onClick={toggleFaceDetection}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-400/15 border border-amber-400/40 text-amber-400 font-bold transition-all hover:bg-amber-400/30"
              >
                {faceLoading ? "LOADING..." : faceActive ? "🔴 DISABLE FACE AI" : "👁 ENABLE FACE AI"}
              </button>
            </div>
            <p className="text-xs font-rajdhani text-gray-400 leading-relaxed mb-3">
              MediaPipe BlazeFace real-time webcam face detection & confidence tracking.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-amber-400/30 text-xs font-mono flex items-center justify-between">
            {faceActive ? (
              <>
                <span className="text-amber-400 font-bold">
                  {faceData.detected ? `👤 DETECTED (${faceData.faceCount})` : "SCANNING FOR FACE..."}
                </span>
                <span className="text-gray-400">{faceData.confidence}% Confidence</span>
              </>
            ) : (
              <span className="text-gray-500">Face AI offline. Click 'ENABLE FACE AI'.</span>
            )}
          </div>
        </div>

        {/* 4. Hand Gesture Control Card */}
        <div className="glass-panel glass-neon-border p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">✋</span>
                <h2 className="font-orbitron text-sm font-bold text-purple-400">
                  HAND GESTURES
                </h2>
              </div>
              <button
                onClick={toggleGesture}
                className="text-[10px] font-mono px-2.5 py-1 rounded bg-purple-400/15 border border-purple-400/40 text-purple-400 font-bold transition-all hover:bg-purple-400/30"
              >
                {gestureLoading ? "LOADING..." : gestureActive ? "🔴 DISABLE GESTURES" : "✋ ENABLE GESTURES"}
              </button>
            </div>
            <p className="text-xs font-rajdhani text-gray-400 leading-relaxed mb-3">
              Hand gestures: ✋ Open Palm (Mic), 👍 Thumbs Up (YouTube), ✌️ V-Sign (Google), ✊ Fist (Calc).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-purple-400/30 text-xs font-mono flex items-center justify-between">
            {gestureActive ? (
              <span className="text-purple-400 font-bold">
                GESTURE: {currentGesture !== "none" ? currentGesture.toUpperCase() : "SCANNING HAND..."}
              </span>
            ) : (
              <span className="text-gray-500">Gestures offline. Click 'ENABLE GESTURES'.</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Toast Feedback Banner */}
      {lastAction && (
        <div className="relative z-10 mt-4 px-4 py-2 rounded-xl bg-black/80 border border-neon-red/40 text-neon-red font-mono text-xs font-bold animate-fade-in shadow-lg">
          {lastAction}
        </div>
      )}

      {/* Global AIAssistant Overlay */}
      <AIAssistant />
    </main>
  );
}
