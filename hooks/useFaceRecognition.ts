"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface FaceDetectionResult {
  detected: boolean;
  faceCount: number;
  confidence: number;
}

export function useFaceRecognition() {
  const [isActive, setIsActive] = useState(false);
  const [faceData, setFaceData] = useState<FaceDetectionResult>({
    detected: false,
    faceCount: 0,
    confidence: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const faceDetectorRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopFaceDetection = useCallback(() => {
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
    setFaceData({ detected: false, faceCount: 0, confidence: 0 });
  }, []);

  const startFaceDetection = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsLoading(true);
    setError(null);

    try {
      const vision = await import("@mediapipe/tasks-vision");
      const { FaceDetector, FilesetResolver } = vision;

      if (!faceDetectorRef.current) {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        faceDetectorRef.current = await FaceDetector.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
              delegate: "GPU",
            },
            runningMode: "VIDEO",
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
        if (!faceDetectorRef.current || !videoRef.current) return;
        const results = faceDetectorRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        const detections = results?.detections || [];
        const detected = detections.length > 0;
        const confidence = detected ? Math.round((detections[0]?.categories?.[0]?.score || 0) * 100) : 0;

        setFaceData({
          detected,
          faceCount: detections.length,
          confidence,
        });

        animFrameRef.current = requestAnimationFrame(detect);
      };

      animFrameRef.current = requestAnimationFrame(detect);
    } catch (err: any) {
      setError(err?.message ?? "Could not access camera for Face Recognition.");
      setIsLoading(false);
      stopFaceDetection();
    }
  }, [stopFaceDetection]);

  const toggleFaceDetection = useCallback(() => {
    if (isActive) {
      stopFaceDetection();
    } else {
      startFaceDetection();
    }
  }, [isActive, startFaceDetection, stopFaceDetection]);

  useEffect(() => {
    return () => {
      stopFaceDetection();
    };
  }, [stopFaceDetection]);

  return { isActive, isLoading, error, faceData, toggleFaceDetection };
}
