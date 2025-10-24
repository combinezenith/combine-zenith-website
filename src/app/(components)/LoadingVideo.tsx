"use client";

import { useState, useEffect, useRef } from "react";

export default function LoadingVideo({ onFinish }: { onFinish?: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 2.5;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(Math.min(pct, 100));
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleVideoEnd = () => {
    setFadeOut(true);
    setTimeout(() => onFinish && onFinish(), 700);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? "opacity-0" : "opacity-100"
      } z-40`} // z-40 so cursor z-50 appears above
    >
      <video
        ref={videoRef}
        src="/loading.mp4"
        autoPlay
        playsInline
        muted
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover absolute top-0 left-0"
      />
      {/* Loading text & progress */}
      <div className="absolute z-40 flex flex-col items-center">
        <div className="text-white font-bold text-2xl animate-pulse mb-4">
          Loading...
        </div>
        <div className="w-64 h-2 bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 transition-all duration-50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
