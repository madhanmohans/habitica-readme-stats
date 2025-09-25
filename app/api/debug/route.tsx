import { NextRequest } from "next/server";
import { createCanvas } from 'canvas';

export const runtime = "nodejs";

function drawSimpleMessage(message: string, bgColor: string = '#2D1B47', textColor: string = 'white'): Buffer {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Configure canvas for better text rendering
  ctx.antialias = 'default';
  ctx.textDrawingMode = 'path';
  
  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 600, 400);
  
  // Text
  ctx.fillStyle = textColor;
  ctx.font = '24px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(message), 300, 200);
  
  return canvas.toBuffer('image/png');
}

function drawDebugInfo(envStatus: { hasUserId: boolean; hasApiToken: boolean; runtime: string }): Buffer {
  const canvas = createCanvas(600, 400);
  const ctx = canvas.getContext('2d');
  
  // Configure canvas for better text rendering
  ctx.antialias = 'default';
  ctx.textDrawingMode = 'path';
  
  // Background
  ctx.fillStyle = '#2D1B47';
  ctx.fillRect(0, 0, 600, 400);
  
  // Title
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial, Helvetica, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Environment Variables Status', 300, 150);
  
  ctx.font = '16px Arial, Helvetica, sans-serif';
  const userIdText = `User ID: ${envStatus.hasUserId ? 'Set' : 'Missing'}`;
  ctx.fillText(userIdText, 300, 190);
  
  const tokenText = `API Token: ${envStatus.hasApiToken ? 'Set' : 'Missing'}`;
  ctx.fillText(tokenText, 300, 220);
  
  const runtimeText = `Runtime: ${String(envStatus.runtime || 'local')}`;
  ctx.fillText(runtimeText, 300, 250);
  
  return canvas.toBuffer('image/png');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const mode = searchParams.get('mode') || 'simple';
    
    if (mode === 'env') {
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

    if (mode === 'json') {
      return new Response(JSON.stringify({
        status: 'Debug API working',
        runtime: 'nodejs',
        hasUserId: !!process.env.HABITICA_USER_ID,
        hasApiToken: !!process.env.HABITICA_API_TOKEN,
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Default simple image
    const imageBuffer = drawSimpleMessage('✅ Debug API is working!');
    return new Response(new Uint8Array(imageBuffer), {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Type': 'image/png',
        'X-Content-Type-Options': 'nosniff',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      },
    });
    
  } catch (error) {
    console.error("Debug API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const imageBuffer = drawSimpleMessage(`Debug Error: ${errorMessage}`, '#2D1B47', '#F74E52');
    
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
