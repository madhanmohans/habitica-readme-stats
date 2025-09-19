"use client";

import { useEffect, useRef, useState } from "react";
import { getHabiticaStats } from "../app/actions/habitica";

interface HabiticaStats {
  hp: number;
  maxHealth: number;
  mp: number;
  maxMP: number;
  exp: number;
  toNextLevel: number;
  lvl: number;
  gp: number;
  class: string;
}

export function HabiticaStats() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState<HabiticaStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHabiticaStats()
      .then(setStats)
      .catch((err) => {
        console.error("Error fetching Habitica stats:", err);
        setError("Failed to load Habitica stats. Please try again later.");
      });
  }, []);

  useEffect(() => {
    if (stats && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawStatsImage(ctx, stats);
      }
    }
  }, [stats]);

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 rounded">{error}</div>;
  }

  if (!stats) {
    return <div className="text-white">Loading Habitica stats...</div>;
  }

  return (
    <div className="relative w-full max-w-[800px] top-10 left-10 object-cover scale-[2] origin-top-left">
      {/* Animated WebP background */}
      <img
        src="/assets/AirshipBackground.webp"
        alt="Airship Background"
        className="absolute top-10 left-10 w-20 h-20 object-cover rounded-lg"
        style={{ zIndex: 1000 }}
      />
      {/* Canvas for text and progress bars */}
      <canvas
        ref={canvasRef}
        width={600}
        height={350}
        className="w-full relative"
        style={{ zIndex: 2 }}
      />
    </div>
  );
}

function drawStatsImage(ctx: CanvasRenderingContext2D, stats: HabiticaStats) {
  // Set background
  ctx.fillStyle = "#2D1B47";
  ctx.fillRect(0, 0, 600, 400);

  // Draw text (airship background is now an HTML img element)
  ctx.font = "24px monospace";
  ctx.fillStyle = "white";
  ctx.fillText(`${stats.class.toUpperCase()}`, 120, 50);
  ctx.font = "18px monospace";
  ctx.fillStyle = "#D3D3D3";
  ctx.fillText(`Level ${stats.lvl}`, 120, 80);

  // Load and draw progress bars with SVG icons
  loadSVGIcon("/assets/HealthIconHabitica.svg", (healthIcon) => {
    drawProgressBarWithIcon(
      ctx,
      healthIcon,
      "Health",
      stats.hp,
      stats.maxHealth,
      "#F74E52",
      20,
      150,
    );
  });

  loadSVGIcon("/assets/ExperienceArtCredits.svg", (expIcon) => {
    drawProgressBarWithIcon(
      ctx,
      expIcon,
      "Experience",
      stats.exp,
      stats.toNextLevel,
      "#FFB445",
      20,
      220,
    );
  });

  loadSVGIcon("/assets/ManaArt.svg", (manaIcon) => {
    drawProgressBarWithIcon(
      ctx,
      manaIcon,
      "Mana",
      stats.mp,
      stats.maxMP,
      "#50B5E9",
      20,
      290,
    );
  });
}

function loadSVGIcon(svgPath: string, callback: (img: HTMLImageElement) => void) {
  const img = new Image();
  img.onload = () => callback(img);
  img.src = svgPath;
}

function drawProgressBarWithIcon(
  ctx: CanvasRenderingContext2D,
  icon: HTMLImageElement,
  label: string,
  value: number,
  max: number,
  color: string,
  x: number,
  y: number,
) {
  const width = 540; // Reduced to make room for icon
  const height = 20;
  const percentage = (value / max) * width;
  const iconSize = 20;

  // Draw icon
  ctx.drawImage(icon, x, y - 15, iconSize, iconSize);

  // Draw label and stats
  ctx.font = "14px monospace";
  ctx.fillStyle = "#D3D3D3";
  ctx.fillText(label, x + iconSize + 5, y - 5);
  ctx.fillText(
    `${Math.floor(value)} / ${max}`,
    x + width - ctx.measureText(`${Math.floor(value)} / ${max}`).width + iconSize,
    y - 5,
  );

  // Draw progress bar background
  ctx.fillStyle = "#4D3B67";
  ctx.fillRect(x + iconSize + 5, y, width, height);

  // Draw progress bar fill
  ctx.fillStyle = color;
  ctx.fillRect(x + iconSize + 5, y, percentage, height);
}

