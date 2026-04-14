"use client";

import { useState, useEffect } from "react";
import { Heart, Sparkles, Sun } from "lucide-react";

export function WelcomeSplash() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("welcomeSeen");
    if (seen) {
      setShow(false);
      return;
    }

    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const hideTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("welcomeSeen", "1");
    }, 3300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.95 0.05 330) 0%, oklch(0.9 0.1 290) 50%, oklch(0.93 0.08 340) 100%)",
      }}
    >
      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
            }}
          >
            <Sparkles
              size={Math.random() * 24 + 12}
              style={{ color: "oklch(0.65 0.18 320)", opacity: 0.5 }}
            />
          </div>
        ))}
      </div>

      <div className="relative text-center px-6 animate-[scale-in_0.6s_cubic-bezier(0.4,0,0.2,1)]">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Heart
            className="w-10 h-10 animate-pulse"
            style={{ color: "oklch(0.65 0.2 340)", fill: "oklch(0.65 0.2 340)" }}
          />
          <Sun
            className="w-12 h-12"
            style={{
              color: "oklch(0.75 0.18 70)",
              animation: "spin 8s linear infinite",
            }}
          />
          <Sparkles
            className="w-10 h-10 animate-pulse"
            style={{ color: "oklch(0.6 0.2 290)" }}
          />
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.4 0.2 290), oklch(0.5 0.22 330), oklch(0.45 0.22 310))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          עבודה מאהבה
        </h1>

        <div
          className="text-xl sm:text-2xl font-semibold"
          style={{ color: "oklch(0.4 0.15 300)" }}
        >
          באנרגיות וויב חיובי ✨
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background: "oklch(0.55 0.2 290)",
                  animation: `float-up 1s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
