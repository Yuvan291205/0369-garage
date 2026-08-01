"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceCommand } from "@/hooks/useVoiceCommand";
import { useGestureControl, GestureType } from "@/hooks/useGestureControl";
import { useFaceRecognition } from "@/hooks/useFaceRecognition";

// ─── Types ────────────────────────────────────────────────────────────────────
type AssistantState = "idle" | "listening" | "thinking" | "speaking";

// ─── Holographic Force-Graph Orb Visualizer ─────────────────────────────────
function HolographicOrbVisualizer({ state }: { state: AssistantState }) {
  const primaryColor = "rgba(255,0,60,0.9)";
  const glowColor = "rgba(255,0,60,0.4)";
  const activeColor = state === "thinking" ? "rgba(255,0,60,0.9)" : primaryColor;

  return (
    <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
      {/* Outer Holographic Radar Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed"
        style={{ borderColor: state === "thinking" ? "rgba(255,0,60,0.6)" : glowColor }}
        animate={{ rotate: 360 }}
        transition={{ duration: state === "listening" ? 4 : 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Orbiting Neural Nodes */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: activeColor,
            boxShadow: `0 0 8px ${activeColor}`,
          }}
          animate={{
            rotate: 360,
            scale: state === "speaking" ? [1, 1.4, 1] : [0.8, 1.1, 0.8],
          }}
          transition={{
            rotate: { duration: 6 + i * 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.2, repeat: Infinity, delay: i * 0.2 },
          }}
        />
      ))}

      {/* Pulsing Core Ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
        animate={{
          scale: state === "listening" ? [1, 1.25, 1] : state === "speaking" ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: state === "idle" ? 0.3 : 0.8,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Core Orb */}
      <motion.div
        className="w-12 h-12 rounded-full relative overflow-hidden flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 35% 35%, rgba(255,0,60,0.95) 0%, rgba(120,0,30,0.95) 100%)",
          boxShadow: "0 0 28px rgba(255,0,60,0.7), inset 0 0 12px rgba(255,150,150,0.4)",
        }}
        animate={{ scale: state === "thinking" ? [0.95, 1.05, 0.95] : [1, 1.04, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-[9px] font-orbitron font-bold text-white tracking-tighter">
          SCORPION
        </span>
      </motion.div>
    </div>
  );
}

// ─── Waveform Bars ──────────────────────────────────────────────────────────
function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ background: "rgba(255,0,60,0.85)" }}
          animate={
            active
              ? { height: ["4px", `${6 + Math.random() * 14}px`, "4px"] }
              : { height: "4px" }
          }
          transition={{
            duration: 0.35 + i * 0.05,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.06,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main UNIFIED SCORPION AI Component ─────────────────────────────────────
export default function AIAssistant() {
  const [state, setState] = useState<AssistantState>("idle");
  const [aiResponse, setAiResponse] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [actionHint, setActionHint] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const actionHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    voiceError,
    toggleListening,
    speak,
    setTranscript,
  } = useVoiceCommand();

  const showActionToast = useCallback((msg: string) => {
    setActionHint(msg);
    if (actionHintTimerRef.current) clearTimeout(actionHintTimerRef.current);
    actionHintTimerRef.current = setTimeout(() => setActionHint(null), 3000);
  }, []);

  // ── UNIFIED VOICE INPUT PROCESSOR (App Launcher + AI Assistant + Controls) ─
  const processVoiceInput = useCallback(
    async (rawText: string) => {
      const lower = rawText.toLowerCase().trim();
      if (!lower) return;

      setState("thinking");
      setAiResponse("");

      // 1. Direct Page Scroll Commands
      if (lower === "scroll down" || lower === "down") {
        setActiveTool("SCROLL_DOWN");
        window.scrollBy({ top: 450, behavior: "smooth" });
        speak("Scrolling down.");
        setAiResponse("⚡ SYSTEM ACTION: Scrolled down");
        setState("speaking");
        return;
      }
      if (lower === "scroll up" || lower === "up") {
        setActiveTool("SCROLL_UP");
        window.scrollBy({ top: -450, behavior: "smooth" });
        speak("Scrolling up.");
        setAiResponse("⚡ SYSTEM ACTION: Scrolled up");
        setState("speaking");
        return;
      }

      // 2. Check if App Launch Request
      const appKeywords = [
        "open ", "launch ", "start ",
        "chrome", "youtube", "google", "calculator", "calc",
        "notepad", "paint", "spotify", "whatsapp", "github",
        "gmail", "maps", "twitter", "reddit", "netflix", "cmd"
      ];

      const isAppLaunch = appKeywords.some((kw) => lower.includes(kw));

      if (isAppLaunch) {
        let appName = lower;
        if (lower.startsWith("open ")) appName = lower.replace("open ", "");
        else if (lower.startsWith("launch ")) appName = lower.replace("launch ", "");
        else if (lower.startsWith("start ")) appName = lower.replace("start ", "");

        setActiveTool(`LAUNCH_${appName.toUpperCase()}`);

        try {
          const res = await fetch("/api/launch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appName }),
          });
          const data = await res.json();

          if (data.success) {
            const speakMsg = `Opening ${data.target} now.`;
            speak(speakMsg);

            if (data.url && typeof window !== "undefined") {
              window.open(data.url, "_blank");
              setAiResponse(`🚀 APP LAUNCHED: Opened ${data.target}`);
            } else {
              setAiResponse(`🚀 APP LAUNCHED: Executed desktop app ${data.target}`);
            }
            setState("speaking");
            return;
          }
        } catch {
          // fallback to AI if app launch fails
        }
      }

      // 3. General AI Assistant & Diagnostic Engine Call
      setActiveTool("AI_NEURAL_ENGINE");
      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: rawText }),
        });
        const data = await res.json();
        const raw = data.diagnosis ?? data.error ?? "Processing complete.";

        const replyStr =
          typeof raw === "object" && raw !== null
            ? `${raw.title ?? "Diagnostic Result"}: ${raw.fixSteps ?? raw.solution ?? JSON.stringify(raw)}`
            : String(raw);

        setAiResponse(replyStr);
        setActiveTool(null);
        setState("speaking");
        speak(replyStr);
      } catch {
        const errStr = "Scorpion AI system connection error.";
        setAiResponse(errStr);
        setActiveTool(null);
        setState("speaking");
        speak(errStr);
      }
    },
    [speak]
  );

  // ── HAND GESTURE CONTROLLER ───────────────────────────────────────────────
  const handleGestureControl = useCallback(
    (gesture: GestureType) => {
      if (gesture === "open_palm") {
        toggleListening();
        showActionToast("✋ Open Palm → Toggled Mic Listening");
      } else if (gesture === "thumbs_up") {
        showActionToast("👍 Thumbs Up → Opening YouTube");
        processVoiceInput("open youtube");
      } else if (gesture === "victory") {
        showActionToast("✌️ Victory V-Sign → Opening Google");
        processVoiceInput("open google");
      } else if (gesture === "closed_fist") {
        showActionToast("✊ Closed Fist → Scrolling Down");
        window.scrollBy({ top: 400, behavior: "smooth" });
      }
    },
    [toggleListening, processVoiceInput, showActionToast]
  );

  const { isActive: gestureActive, toggleGesture, isLoading: gestureLoading } =
    useGestureControl({ onGesture: handleGestureControl });

  // ── FACE RECOGNITION HOOK ──────────────────────────────────────────────────
  const {
    isActive: faceActive,
    isLoading: faceLoading,
    faceData,
    toggleFaceDetection,
  } = useFaceRecognition();

  // Sync state with voice
  useEffect(() => {
    if (isListening) setState("listening");
    else if (!isSpeaking && state === "listening") setState("idle");
  }, [isListening, isSpeaking, state]);

  useEffect(() => {
    if (isSpeaking) setState("speaking");
    else if (state === "speaking") setState("idle");
  }, [isSpeaking, state]);

  // Execute voice input when final transcript finishes
  useEffect(() => {
    if (transcript && !isSpeaking) {
      processVoiceInput(transcript);
      setTranscript("");
    }
  }, [transcript, isSpeaking, processVoiceInput, setTranscript]);

  const handleToggleListen = useCallback(() => {
    setIsVisible(true);
    setIsMinimized(false);
    toggleListening();
  }, [toggleListening]);

  const stateLabel: Record<AssistantState, string> = {
    idle: "STANDBY",
    listening: "LISTENING",
    thinking: "PROCESSING",
    speaking: "SPEAKING",
  };

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <motion.button
        id="ai-assistant-trigger"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer shadow-2xl"
        style={{
          background: isListening
            ? "radial-gradient(circle, #ff003c 0%, rgba(10,11,13,1) 100%)"
            : "radial-gradient(circle, rgba(20,22,28,0.95) 0%, rgba(10,11,13,1) 100%)",
          border: isListening ? "2px solid #ff003c" : "1px solid rgba(255,255,255,0.15)",
          boxShadow: isListening ? "0 0 35px #ff003c, 0 0 70px #ff003c33" : "0 0 20px rgba(255,0,60,0.2)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleToggleListen}
        aria-label="Toggle SCORPION Assistant"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-7 h-7"
          animate={isListening ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <path
            d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"
            fill={isListening ? "#0a0b0d" : "#ff003c"}
          />
          <path
            d="M19 10a7 7 0 0 1-14 0"
            stroke={isListening ? "#0a0b0d" : "#ff003c"}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 19v3M9 22h6"
            stroke={isListening ? "#0a0b0d" : "#ff003c"}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.button>

      {/* ── Main Panel ── */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id="ai-assistant-panel"
            className="fixed bottom-24 right-6 z-50 w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(10,11,13,0.94)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,0,60,0.35)",
              boxShadow: "0 0 50px rgba(255,0,60,0.2), 0 24px 48px rgba(0,0,0,0.8)",
            }}
            initial={{ opacity: 0, y: 24, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.93 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neon-red/20">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-widest font-orbitron text-neon-red">
                  SCORPION AI
                </span>
                <span className="text-[9px] tracking-widest px-2 py-0.5 rounded-full font-rajdhani uppercase font-bold bg-neon-red/15 text-neon-red border border-neon-red/30">
                  {stateLabel[state]}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Face AI Button */}
                <button
                  title={faceActive ? "Disable Face AI" : "Enable Face AI"}
                  onClick={toggleFaceDetection}
                  className="text-xs p-1.5 rounded-lg transition-colors"
                  style={{
                    background: faceActive ? "rgba(234,179,8,0.2)" : "rgba(255,255,255,0.04)",
                    color: faceLoading ? "#eab308" : faceActive ? "#eab308" : "rgba(255,255,255,0.3)",
                    border: `1px solid ${faceActive ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  👤
                </button>

                {/* Gesture Toggle */}
                <button
                  id="ai-gesture-toggle"
                  title={gestureActive ? "Disable Gestures" : "Enable Gestures"}
                  onClick={toggleGesture}
                  className="text-xs p-1.5 rounded-lg transition-colors"
                  style={{
                    background: gestureActive ? "rgba(255,0,60,0.2)" : "rgba(255,255,255,0.04)",
                    color: gestureLoading ? "#ff003c" : gestureActive ? "#ff003c" : "rgba(255,255,255,0.3)",
                    border: `1px solid ${gestureActive ? "rgba(255,0,60,0.4)" : "rgba(255,255,255,0.08)"}`,
                  }}
                >
                  ✋
                </button>

                {/* Minimize */}
                <button
                  id="ai-minimize"
                  onClick={() => setIsMinimized((v) => !v)}
                  className="text-xs p-1.5 rounded-lg text-gray-400 hover:text-white"
                >
                  {isMinimized ? "↑" : "↓"}
                </button>
                {/* Close */}
                <button
                  id="ai-close"
                  onClick={() => { setIsVisible(false); if (isListening) toggleListening(); }}
                  className="text-xs p-1.5 rounded-lg text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1.5 text-[9px] font-mono bg-black/50 border-b border-white/5 text-gray-400">
              <span className="text-electric-blue">🎙️ VOICE: {isListening ? "ACTIVE" : "STANDBY"}</span>
              <span className={faceActive ? "text-amber-400" : "text-gray-600"}>
                👤 FACE: {faceActive ? (faceData.detected ? "DETECTED" : "SCANNING") : "OFF"}
              </span>
              <span className={gestureActive ? "text-neon-red" : "text-gray-600"}>
                ✋ GESTURE: {gestureActive ? "ON" : "OFF"}
              </span>
            </div>

            {/* Panel Body */}
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Holographic Orb + Waveform Row */}
                  <div className="flex items-center gap-4 px-4 py-4">
                    <HolographicOrbVisualizer state={state} />
                    <div className="flex flex-col gap-1.5 flex-1">
                      <WaveformBars active={state === "speaking"} />
                      <p className="text-[11px] font-rajdhani leading-relaxed text-gray-400">
                        {state === "idle" && "Speak any question or app command (e.g. 'Open Chrome')."}
                        {state === "listening" && "Listening to voice..."}
                        {state === "thinking" && "Processing request..."}
                        {state === "speaking" && "Scorpion speaking:"}
                      </p>
                      {activeTool && (
                        <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono bg-neon-red/15 text-neon-red border border-neon-red/30 animate-pulse font-bold">
                          SYSTEM: [{activeTool}]
                        </span>
                      )}
                    </div>
                  </div>

                  {/* AI / System Response Text */}
                  <AnimatePresence mode="wait">
                    {aiResponse && (
                      <motion.div
                        key={aiResponse}
                        className="mx-4 mb-3 p-3 rounded-xl text-xs font-mono leading-relaxed bg-neon-red/10 border border-neon-red/30 text-white max-h-36 overflow-y-auto"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        {aiResponse}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Live Transcript / Error Preview */}
                  <AnimatePresence>
                    {voiceError ? (
                      <motion.div
                        className="mx-4 mb-3 px-3 py-2 rounded-lg text-xs font-mono font-bold bg-red-950/80 border border-red-500/50 text-red-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        ⚠️ {voiceError}
                      </motion.div>
                    ) : isListening && (interimTranscript || transcript) ? (
                      <motion.div
                        className="mx-4 mb-3 px-3 py-2 rounded-lg text-xs font-rajdhani italic bg-electric-blue/10 border border-electric-blue/30 text-electric-blue"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        "{interimTranscript || transcript}"
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {/* Action / Gesture Toast */}
                  <AnimatePresence>
                    {actionHint && (
                      <motion.div
                        className="mx-4 mb-3 px-3 py-2 rounded-lg text-xs font-rajdhani font-bold text-center bg-neon-red/20 border border-neon-red/40 text-neon-red"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        {actionHint}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Buttons */}
                  <div className="flex gap-2 px-4 pb-4">
                    <button
                      id="ai-listen-btn"
                      onClick={handleToggleListen}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-widest font-orbitron transition-all duration-200"
                      style={{
                        background: isListening ? "rgba(255,0,60,0.25)" : "rgba(255,0,60,0.15)",
                        border: "1px solid rgba(255,0,60,0.4)",
                        color: "#ff003c",
                        boxShadow: isListening ? "0 0 15px rgba(255,0,60,0.3)" : "none",
                      }}
                    >
                      {isListening ? "◼ STOP" : "🎙️ START SPEAKING"}
                    </button>
                    <button
                      id="ai-gesture-btn"
                      onClick={toggleGesture}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold font-orbitron transition-all duration-200"
                      style={{
                        background: gestureActive ? "rgba(255,0,60,0.2)" : "rgba(255,255,255,0.04)",
                        border: `1px solid ${gestureActive ? "rgba(255,0,60,0.4)" : "rgba(255,255,255,0.1)"}`,
                        color: gestureActive ? "#ff003c" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {gestureLoading ? "…" : gestureActive ? "👁 GESTURE" : "✋ GESTURE"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        #ai-assistant-panel::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,0,60,0.015) 2px,
            rgba(255,0,60,0.015) 4px
          );
          border-radius: inherit;
          z-index: 1;
        }
        #ai-assistant-panel > * {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </>
  );
}
