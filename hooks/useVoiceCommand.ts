"use client";

import { useEffect, useState, useCallback } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ─── Shared Global State Singleton ──────────────────────────────────────────
type ListenerFn = () => void;

class VoiceManager {
  private static instance: VoiceManager;
  public recognition: any = null;
  public synth: SpeechSynthesis | null = null;
  public voices: SpeechSynthesisVoice[] = [];

  public isListening = false;
  public transcript = "";
  public interimTranscript = "";
  public isSpeaking = false;
  public hasSupport = true;
  public voiceError: string | null = null;

  private isStarted = false;
  private shouldListen = false;
  private listeners: Set<ListenerFn> = new Set();

  private constructor() {
    if (typeof window === "undefined") return;

    this.synth = window.speechSynthesis;
    const loadVoices = () => {
      if (this.synth) {
        this.voices = this.synth.getVoices() || [];
      }
    };
    loadVoices();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.hasSupport = false;
      this.voiceError =
        "Web Speech API is not supported in this browser. Please use Google Chrome or Edge.";
      return;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onstart = () => {
        this.isStarted = true;
        this.isListening = true;
        this.voiceError = null;
        this.notify();
      };

      this.recognition.onresult = (event: any) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalStr += text;
          } else {
            interimStr += text;
          }
        }

        if (interimStr) {
          this.interimTranscript = interimStr;
        }

        if (finalStr) {
          this.transcript = finalStr.trim();
          this.interimTranscript = "";
        }
        this.notify();
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === "no-speech") return;

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.voiceError =
            "Microphone access denied. Please click the mic icon in your browser address bar to allow microphone access.";
          this.shouldListen = false;
          this.isListening = false;
          this.isStarted = false;
          this.notify();
          return;
        }

        this.voiceError = `Voice recognition error: ${event.error}`;
        this.notify();
      };

      this.recognition.onend = () => {
        this.isStarted = false;
        if (this.shouldListen) {
          try {
            this.recognition.start();
          } catch (e) {}
        } else {
          this.isListening = false;
          this.notify();
        }
      };
    } catch (err: any) {
      this.hasSupport = false;
      this.voiceError = `Speech Recognition error: ${err.message}`;
    }
  }

  public static getInstance(): VoiceManager {
    if (!VoiceManager.instance) {
      VoiceManager.instance = new VoiceManager();
    }
    return VoiceManager.instance;
  }

  public subscribe(fn: ListenerFn) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  public notify() {
    this.listeners.forEach((fn) => fn());
  }

  public startListening() {
    if (!this.recognition) return;
    this.shouldListen = true;
    this.transcript = "";
    this.interimTranscript = "";
    this.voiceError = null;

    if (!this.isStarted) {
      try {
        this.recognition.start();
      } catch (e) {}
    }
    this.notify();
  }

  public stopListening() {
    this.shouldListen = false;
    if (this.recognition && this.isStarted) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.notify();
  }

  public toggleListening() {
    if (this.shouldListen || this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  public setTranscript(val: string) {
    this.transcript = val;
    this.notify();
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth || typeof window === "undefined") return;

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = this.voices.length > 0 ? this.voices : this.synth.getVoices();
      const femaleVoices = voices.filter(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("victoria") ||
          v.name.toLowerCase().includes("google uk english female")
      );

      if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0];
      } else {
        const engVoices = voices.filter((v) => v.lang.startsWith("en"));
        if (engVoices.length > 0) utterance.voice = engVoices[0];
      }

      utterance.pitch = 1.05;
      utterance.rate = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.notify();
      };
      utterance.onend = () => {
        this.isSpeaking = false;
        this.notify();
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.isSpeaking = false;
        this.notify();
      };

      this.synth.speak(utterance);
    } catch (err) {
      this.isSpeaking = false;
      this.notify();
    }
  }
}

export function useVoiceCommand() {
  const manager = VoiceManager.getInstance();
  const [, setTick] = useState(0);

  useEffect(() => {
    return manager.subscribe(() => setTick((t) => t + 1));
  }, [manager]);

  const toggleListening = useCallback(() => manager.toggleListening(), [manager]);
  const startListening = useCallback(() => manager.startListening(), [manager]);
  const stopListening = useCallback(() => manager.stopListening(), [manager]);
  const speak = useCallback((text: string, onEnd?: () => void) => manager.speak(text, onEnd), [manager]);
  const setTranscript = useCallback((val: string) => manager.setTranscript(val), [manager]);

  return {
    isListening: manager.isListening,
    isSpeaking: manager.isSpeaking,
    transcript: manager.transcript,
    interimTranscript: manager.interimTranscript,
    hasSupport: manager.hasSupport,
    voiceError: manager.voiceError,
    toggleListening,
    startListening,
    stopListening,
    speak,
    setTranscript,
  };
}
