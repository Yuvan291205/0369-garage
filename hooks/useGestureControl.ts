"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type GestureType = "open_palm" | "thumbs_up" | "victory" | "closed_fist" | "none";

interface GestureControlOptions {
  onGesture?: (gesture: GestureType) => void;
}

export function useGestureControl({ onGesture }: GestureControlOptions = {}) {
  const [isActive, setIsActive] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<GestureType>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const gestureRecognizerRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastGestureRef = useRef<GestureType>("none");

  // Keep latest onGesture callback in ref without re-triggering effects
  const onGestureRef = useRef(onGesture);
  useEffect(() => {
    onGestureRef.current = onGesture;
  }, [onGesture]);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setCurrentGesture("none");
    lastGestureRef.current = "none";
  }, []);

  const startCamera = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsLoading(true);
    setError(null);

    try {
      const vision = await import("@mediapipe/tasks-vision");
      const { GestureRecognizer, FilesetResolver } = vision;

      if (!gestureRecognizerRef.current) {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
            numHands: 1,
          }
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      await new Promise<void>((res) => { video.onloadeddata = () => res(); });
      videoRef.current = video;

      setIsActive(true);
      setIsLoading(false);

      const detect = () => {
        if (!gestureRecognizerRef.current || !videoRef.current) return;
        const results = gestureRecognizerRef.current.recognizeForVideo(
          videoRef.current,
          performance.now()
        );

        let detected: GestureType = "none";
        if (results?.gestures?.[0]?.[0]) {
          const name = results.gestures[0][0].categoryName;
          if (name === "Open_Palm") detected = "open_palm";
          else if (name === "Thumb_Up") detected = "thumbs_up";
          else if (name === "Victory") detected = "victory";
          else if (name === "Closed_Fist") detected = "closed_fist";
        }

        if (detected !== lastGestureRef.current) {
          lastGestureRef.current = detected;
          setCurrentGesture(detected);
          onGestureRef.current?.(detected);
        }

        animFrameRef.current = requestAnimationFrame(detect);
      };

      animFrameRef.current = requestAnimationFrame(detect);
    } catch (err: any) {
      setError(err?.message ?? "Could not access webcam or load gesture model.");
      setIsLoading(false);
      stopCamera();
    }
  }, [stopCamera]);

  const toggleGesture = useCallback(() => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isActive, startCamera, stopCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { isActive, isLoading, error, currentGesture, toggleGesture };
}
