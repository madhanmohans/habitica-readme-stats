import { NextRequest } from "next/server";
import { getHabiticaStats } from "../../actions/habitica";
import { createCanvas, CanvasRenderingContext2D } from 'canvas';

// Types
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

interface Theme {
  background: string;
  text: string;
  subtext: string;
}

// Canvas drawing utilities
function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function drawProgressBar(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, value: number, max: number, color: string, bgColor: string) {
  // Background
  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, x, y, width, height, 10);
  
  // Progress
  const percentage = Math.min(100, (value / max) * 100);
  const progressWidth = (width * percentage) / 100;
  
  if (progressWidth > 0) {
    ctx.fillStyle = color;
    drawRoundedRect(ctx, x, y, progressWidth, height, 10);
  }
}

function drawStatsCard(stats: HabiticaStats, theme: Theme): Buffer {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 600, 400);
  
  // Character avatar circle
  const avatarX = 150;
  const avatarY = 100;
  const avatarRadius = 40;
  
  ctx.fillStyle = '#8B5CF6';
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
  ctx.fill();
  
  // Game controller icon (text-based)
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GAME', avatarX, avatarY + 5);
  
  // Character info
  ctx.fillStyle = theme.text;
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`@${stats.class.toLowerCase()}`, avatarX + 50, avatarY - 10);
  
  ctx.fillStyle = theme.subtext;
  ctx.font = '18px sans-serif';
  ctx.fillText(`Level ${stats.lvl} ${stats.class}`, avatarX + 50, avatarY + 15);
  
  // Progress bars
  const barsStartY = 180;
  const barHeight = 20;
  const barWidth = 320;
  const barSpacing = 45;
  const barsX = (600 - barWidth) / 2;
  
  // Health bar
  ctx.fillStyle = theme.subtext;
  ctx.font = '14px sans-serif';
  ctx.fillText('Health', barsX, barsStartY - 5);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.floor(stats.hp)} / ${stats.maxHealth}`, barsX + barWidth, barsStartY - 5);
  ctx.textAlign = 'left';
  
  drawProgressBar(ctx, barsX, barsStartY + 5, barWidth, barHeight, stats.hp, stats.maxHealth, '#F74E52', '#4D3B67');
  
  // Experience bar
  const expY = barsStartY + barSpacing;
  ctx.fillStyle = theme.subtext;
  ctx.fillText('Experience', barsX, expY - 5);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.floor(stats.exp)} / ${stats.toNextLevel}`, barsX + barWidth, expY - 5);
  ctx.textAlign = 'left';
  
  drawProgressBar(ctx, barsX, expY + 5, barWidth, barHeight, stats.exp, stats.toNextLevel, '#FFB445', '#4D3B67');
  
  // Mana bar
  const manaY = barsStartY + (barSpacing * 2);
  ctx.fillStyle = theme.subtext;
  ctx.fillText('Mana', barsX, manaY - 5);
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.floor(stats.mp)} / ${stats.maxMP}`, barsX + barWidth, manaY - 5);
  ctx.textAlign = 'left';
  
  drawProgressBar(ctx, barsX, manaY + 5, barWidth, barHeight, stats.mp, stats.maxMP, '#50B5E9', '#4D3B67');
  
  return canvas.toBuffer('image/png');
}

function drawSimpleMessage(message: string, bgColor: string = '#2D1B47', textColor: string = 'white'): Buffer {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 600, 400);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(message, 300, 200);
  
  return canvas.toBuffer('image/png');
}

function drawDebugInfo(envStatus: { hasUserId: boolean; hasApiToken: boolean; runtime: string }): Buffer {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = '#2D1B47';
  ctx.fillRect(0, 0, 600, 400);
  
  // Title
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Environment Variables Status:', 300, 150);
  
  ctx.font = '16px sans-serif';
  ctx.fillText(`User ID: ${envStatus.hasUserId ? 'Set' : 'Missing'}`, 300, 190);
  ctx.fillText(`API Token: ${envStatus.hasApiToken ? 'Set' : 'Missing'}`, 300, 220);
  ctx.fillText(`Runtime: ${envStatus.runtime || 'local'}`, 300, 250);
  
  return canvas.toBuffer('image/png');
}

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    console.log('Habitica Stats API called');
    console.log('Environment variables check:', {
      hasUserId: !!process.env.HABITICA_USER_ID,
      hasApiToken: !!process.env.HABITICA_API_TOKEN,
      nodeEnv: process.env.NODE_ENV,
      runtime: process.env.VERCEL_ENV
    });
    
    // Get theme from query parameters (only non-sensitive parameter allowed)
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme') || 'default';
    
    // Check for debug mode
    const debug = searchParams.get('debug');
    
    // Test if basic function works
    if (debug === 'test') {
      return new Response(JSON.stringify({
        status: 'API working',
        runtime: 'nodejs',
        hasUserId: !!process.env.HABITICA_USER_ID,
        hasApiToken: !!process.env.HABITICA_API_TOKEN,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (debug === 'simple') {
      const imageBuffer = drawSimpleMessage('✅ Habitica Stats API is working!');
      return new Response(new Uint8Array(imageBuffer), {
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'Content-Type': 'image/png',
          'X-Content-Type-Options': 'nosniff',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      });
    }

    if (debug === 'env') {
      const envStatus = {
        hasUserId: !!process.env.HABITICA_USER_ID,
        hasApiToken: !!process.env.HABITICA_API_TOKEN,
        runtime: process.env.VERCEL_ENV || 'local'
      };
      const imageBuffer = drawDebugInfo(envStatus);
      return new Response(new Uint8Array(imageBuffer), {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'Content-Type': 'image/png',
          'X-Content-Type-Options': 'nosniff',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      });
    }

    // Securely fetch stats using environment variables
    let stats: HabiticaStats;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API call timed out after 10 seconds')), 10000)
      );
      
      stats = await Promise.race([
        getHabiticaStats(),
        timeoutPromise
      ]);
      
      console.log('Stats fetched successfully:', { 
        class: stats.class, 
        level: stats.lvl, 
        hp: stats.hp, 
        maxHealth: stats.maxHealth 
      });
    } catch (apiError) {
      console.error('Error fetching Habitica stats:', apiError);
      
      // Return a specific error image for API failures
      const errorMessage = apiError instanceof Error ? apiError.message : "Failed to fetch Habitica data";
      const canvas = createCanvas(600, 400);
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#2D1B47';
      ctx.fillRect(0, 0, 600, 400);
      
      // Error text
      ctx.fillStyle = '#F74E52';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Configuration Error', 300, 150);
      
      ctx.font = '14px sans-serif';
      ctx.fillStyle = 'white';
      // Wrap long error messages
      const words = errorMessage.split(' ');
      let line = '';
      let y = 190;
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > 500 && n > 0) {
          ctx.fillText(line, 300, y);
          line = words[n] + ' ';
          y += 20;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 300, y);
      
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#999';
      ctx.fillText('Please check environment variables: HABITICA_USER_ID & HABITICA_API_TOKEN', 300, y + 40);
      
      const imageBuffer = canvas.toBuffer('image/png');
      return new Response(new Uint8Array(imageBuffer), {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'Content-Type': 'image/png',
          'X-Content-Type-Options': 'nosniff',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      });
    }

    // Theme configuration
    const themes = {
      default: {
        background: "#2D1B47",
        text: "white",
        subtext: "#D3D3D3",
      },
      dark: {
        background: "#0f0f23",
        text: "#cccccc",
        subtext: "#999999",
      },
      light: {
        background: "#ffffff",
        text: "#24292e",
        subtext: "#586069",
      },
    };

    const currentTheme = themes[theme as keyof typeof themes] || themes.default;

    // Generate the stats image using canvas
    const imageBuffer = drawStatsCard(stats, currentTheme);
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes  
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const imageBuffer = drawSimpleMessage(`Unexpected Error: ${errorMessage}`, '#2D1B47', '#F74E52');
    
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Cache-Control': 'public, max-age=300, s-maxage=300',
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  }
}
