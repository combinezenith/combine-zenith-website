"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function WebsiteLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<
    { left: number; top: number; delay: number; duration: number }[]
  >([]);

  useEffect(() => {
    // Generate random particles only on the client (prevents SSR mismatch)
    const generatedParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
    }));
    setParticles(generatedParticles);

    // Check if user has visited before
    const hasVisited = localStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    const startTime = Date.now();
    const duration = 5000; // 5 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);

      if (elapsed < duration) {
        requestAnimationFrame(updateProgress);
      } else {
        localStorage.setItem("hasVisited", "true");
        setIsLoading(false);
      }
    };

    updateProgress();
  }, []);

  if (!isLoading) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background particles (hydration-safe) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        <div className="relative">
          <div className="animate-spin-slow">
            <Image
              src="/star.png"
              width={120}
              height={120}
              alt="Combine Zenith Logo"
              className="drop-shadow-2xl"
            />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-20"></div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white font-surgena animate-pulse">
            Combine Zenith
          </h1>
          <p className="text-purple-300 text-lg animate-fade-in">
            Bringing Your Vision to Life
          </p>
        </div>

        <div className="w-80 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-purple-500 to-purple-300 transition-all duration-100 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-white text-sm font-medium">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
