"use client";

import { useEffect, useRef } from "react";

export default function CursorSpark() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positions = useRef<{ x: number; y: number }[]>([]);
  const numDots = 8;

  useEffect(() => {
    positions.current = Array(numDots).fill({ x: 0, y: 0 });

    document.body.style.cursor = "none";

    const handleMouseMove = (e: MouseEvent) => {
      positions.current[0] = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      for (let i = 1; i < numDots; i++) {
        const prev = positions.current[i - 1];
        const curr = positions.current[i];

        positions.current[i] = {
          x: curr.x + (prev.x - curr.x) * 0.6,
          y: curr.y + (prev.y - curr.y) * 0.6,
        };
      }

      if (cursorRef.current) {
        const stars = cursorRef.current.children;
        for (let i = 0; i < stars.length; i++) {
          const star = stars[i] as HTMLSpanElement;
          const pos = positions.current[i];
          const size = 12 + (numDots - i) * 2.5;
          const scale = 1 - (i / numDots) * 0.4;
          const opacity = 1 - (i / numDots) * 0.7;

          star.style.width = `${size}px`;
          star.style.height = `${size}px`;
          star.style.transform = `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px) scale(${scale})`;
          star.style.opacity = `${opacity}`;
          
          // Proper 4-point star using clip-path
          star.style.clipPath = `polygon(
            50% 0%,
            61% 35%,
            100% 50%,
            61% 65%,
            50% 100%,
            39% 65%,
            0% 50%,
            39% 35%
          )`;
          
          star.style.backgroundColor = "#9b5de5";
          star.style.boxShadow = `0 0 ${8 + i * 2}px rgba(155, 93, 229, 0.8)`;
          star.style.filter = `blur(${i * 0.2}px)`;
          
          // Ensure cursor appears above all content including popups
          star.style.zIndex = "9999";
        }
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
    >
      {Array.from({ length: numDots }).map((_, i) => (
        <span key={i} className="absolute transition-all duration-75" />
      ))}
    </div>
  );
}