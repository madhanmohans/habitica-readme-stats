import { getHabiticaStats } from "../../actions/habitica";
import { createCanvas, registerFont, CanvasRenderingContext2D } from 'canvas';
import path from 'path';

// Register bundled Geist fonts so they are available in node-canvas
// These fonts ship with the project and work reliably on Vercel
const fontsDir = path.join(process.cwd(), 'app', 'fonts');
try {
  registerFont(path.join(fontsDir, 'GeistVF.woff'), { family: 'Geist', weight: '400' });
  registerFont(path.join(fontsDir, 'GeistMonoVF.woff'), { family: 'GeistMono', weight: '400' });
} catch {
  // Fonts may already be registered or path may differ in build — silently continue
}

// Fallback font stack: try Geist first, then common system fonts
const FONT_SANS = 'Geist, Arial, Helvetica, sans-serif';
const FONT_MONO = 'GeistMono, "Courier New", monospace';

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
  ctx.fillStyle = bgColor;
  drawRoundedRect(ctx, x, y, width, height, 10);
  
  const percentage = Math.min(100, (value / max) * 100);
  const progressWidth = (width * percentage) / 100;
  
  if (progressWidth > 0) {
    ctx.fillStyle = color;
    drawRoundedRect(ctx, x, y, progressWidth, height, 10);
  }
}

function drawStatsCard(stats: HabiticaStats, theme: Theme): Buffer {
  const canvas = createCanvas(500, 300);
  const ctx = canvas.getContext('2d');
  
  ctx.antialias = 'default';
  ctx.textDrawingMode = 'path';
  
  // Background
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, 500, 300);
  
  // Character info
  const avatarX = 100;
  const avatarY = 50;
  
  ctx.fillStyle = theme.text;
  ctx.font = `bold 24px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const username = String(stats.class);
  const levelText = `level ${Number(stats.lvl)}`;
  ctx.fillText(username + ' ' + levelText, avatarX + 45, avatarY);
  
  // Progress bars
  const barsStartY = 120;
  const barHeight = 20;
  const barWidth = 320;
  const barSpacing = 45;
  const barsX = (500 - barWidth) / 2;

  // Health bar
  ctx.fillStyle = theme.subtext;
  ctx.font = `14px ${FONT_SANS}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('health', barsX, barsStartY - 5);
  ctx.textAlign = 'right';
  const healthText = `${Math.floor(Number(stats.hp))} / ${Number(stats.maxHealth)}`;
  ctx.fillText(healthText, barsX + barWidth, barsStartY - 5);
  drawProgressBar(ctx, barsX, barsStartY + 5, barWidth, barHeight, stats.hp, stats.maxHealth, '#F74E52', '#4D3B67');

  // Experience bar
  const expY = barsStartY + barSpacing;
  ctx.fillStyle = theme.subtext;
  ctx.textAlign = 'left';
  ctx.fillText('experience', barsX, expY - 5);
  ctx.textAlign = 'right';
  const expText = `${Math.floor(Number(stats.exp))} / ${Number(stats.toNextLevel)}`;
  ctx.fillText(expText, barsX + barWidth, expY - 5);
  drawProgressBar(ctx, barsX, expY + 5, barWidth, barHeight, stats.exp, stats.toNextLevel, '#FFB445', '#4D3B67');
  
  // Mana bar
  const manaY = barsStartY + (barSpacing * 2);
  ctx.fillStyle = theme.subtext;
  ctx.textAlign = 'left';
  ctx.fillText('mana', barsX, manaY - 5);
  ctx.textAlign = 'right';
  const manaText = `${Math.floor(Number(stats.mp))} / ${Number(stats.maxMP)}`;
  ctx.fillText(manaText, barsX + barWidth, manaY - 5);
  drawProgressBar(ctx, barsX, manaY + 5, barWidth, barHeight, stats.mp, stats.maxMP, '#50B5E9', '#4D3B67');
  
  return canvas.toBuffer('image/png');
}

function drawErrorCard(message: string): Buffer {
  const canvas = createCanvas(500, 300);
  const ctx = canvas.getContext('2d');
  
  ctx.antialias = 'default';
  ctx.textDrawingMode = 'path';
  
  ctx.fillStyle = '#2D1B47';
  ctx.fillRect(0, 0, 500, 300);
  
  ctx.fillStyle = '#F74E52';
  ctx.font = `bold 24px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Configuration Error', 250, 130);
  
  ctx.font = `14px ${FONT_SANS}`;
  ctx.fillStyle = 'white';
  const shortError = message.length > 50 ? message.substring(0, 50) + '...' : message;
  ctx.fillText(shortError, 250, 170);
  
  ctx.font = `12px ${FONT_SANS}`;
  ctx.fillStyle = '#999';
  ctx.fillText('Please check environment variables', 250, 210);
  ctx.fillText('HABITICA_USER_ID & HABITICA_API_TOKEN', 250, 230);
  
  return canvas.toBuffer('image/png');
}

export const runtime = "nodejs";

const theme: Theme = {
  background: "#2D1B47",
  text: "white",
  subtext: "#D3D3D3",
};

export async function GET() {
  try {
    const stats = await Promise.race([
      getHabiticaStats(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('API call timed out')), 10000)
      )
    ]);

    const imageBuffer = drawStatsCard(stats, theme);
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=60',
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const imageBuffer = drawErrorCard(errorMessage);
    
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
