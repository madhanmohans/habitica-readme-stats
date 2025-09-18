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
    <canvas
      ref={canvasRef}
      width={600}
      height={350}
      className="w-full max-w-[600px]"
    />
  );
}

function drawStatsImage(ctx: CanvasRenderingContext2D, stats: HabiticaStats) {
  // Set background
  ctx.fillStyle = "#2D1B47";
  ctx.fillRect(0, 0, 600, 400);

  // Draw Habitica icon
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 20, 20, 80, 80);

    // Draw text
    ctx.font = "24px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(`@${stats.class.toLowerCase()}`, 120, 50);
    ctx.font = "18px monospace";
    ctx.fillStyle = "#D3D3D3";
    ctx.fillText(`Level ${stats.lvl} ${stats.class}`, 120, 80);

    // Draw progress bars
    drawProgressBar(
      ctx,
      "❤️ Health",
      stats.hp,
      stats.maxHealth,
      "#F74E52",
      20,
      120,
    );
    drawProgressBar(
      ctx,
      "⭐ Experience",
      stats.exp,
      stats.toNextLevel,
      "#FFB445",
      20,
      200,
    );
    drawProgressBar(ctx, "💎 Mana", stats.mp, stats.maxMP, "#50B5E9", 20, 280);
  };
  img.src =
    "https://img.utdstc.com/icon/e99/6e9/e996e9fc7515afb60de11013c71209a2f12cf50d7ca67d88fb5fa280cf2f83c2:200";
}

function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: number,
  max: number,
  color: string,
  x: number,
  y: number,
) {
  const width = 560;
  const height = 20;
  const percentage = (value / max) * width;

  ctx.font = "14px monospace";
  ctx.fillStyle = "#D3D3D3";
  ctx.fillText(label, x, y - 10);
  ctx.fillText(
    `${Math.floor(value)} / ${max}`,
    x + width - ctx.measureText(`${Math.floor(value)} / ${max}`).width,
    y - 10,
  );

  ctx.fillStyle = "#4D3B67";
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, percentage, height);
}
