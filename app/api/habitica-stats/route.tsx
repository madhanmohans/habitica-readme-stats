import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getHabiticaStats } from "../../actions/habitica";

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
    
    if (debug === 'simple') {
      return new ImageResponse(
        (
          <div
            style={{
              width: 600,
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2D1B47",
              color: "white",
              fontSize: "24px",
            }}
          >
            ✅ Habitica Stats API is working!
          </div>
        ),
        {
          width: 600,
          height: 400,
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            'Content-Type': 'image/png',
          },
        }
      );
    }

    if (debug === 'env') {
      return new ImageResponse(
        (
          <div
            style={{
              width: 600,
              height: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2D1B47",
              color: "white",
              fontSize: "16px",
              padding: "20px",
            }}
          >
            <div>Environment Variables Status:</div>
            <div>User ID: {process.env.HABITICA_USER_ID ? '✅ Set' : '❌ Missing'}</div>
            <div>API Token: {process.env.HABITICA_API_TOKEN ? '✅ Set' : '❌ Missing'}</div>
            <div>Runtime: {process.env.VERCEL_ENV || 'local'}</div>
          </div>
        ),
        {
          width: 600,
          height: 400,
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300',
            'Content-Type': 'image/png',
          },
        }
      );
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
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2D1B47",
              fontFamily: "monospace",
              color: "#F74E52",
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
              Configuration Error
            </h2>
            <p style={{ fontSize: "14px", textAlign: "center", margin: "0", maxWidth: "80%" }}>
              {apiError instanceof Error ? apiError.message : "Failed to fetch Habitica data"}
            </p>
            <p style={{ fontSize: "12px", textAlign: "center", margin: "10px 0 0 0", color: "#999" }}>
              Please check environment variables: HABITICA_USER_ID & HABITICA_API_TOKEN
            </p>
          </div>
        ),
        {
          width: 600,
          height: 400,
          headers: {
            'Cache-Control': 'public, max-age=300, s-maxage=300',
            'Content-Type': 'image/png',
          },
        }
      );
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

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: currentTheme.background,
            fontFamily: "monospace",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#8B5CF6",
                borderRadius: "50%",
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}
            >
              🎮
            </div>
            <div>
              <h1 style={{ fontSize: "28px", margin: "0", color: currentTheme.text }}>
                @{stats.class.toLowerCase()}
              </h1>
              <p style={{ fontSize: "18px", margin: "5px 0 0 0", color: currentTheme.subtext }}>
                Level {stats.lvl} {stats.class}
              </p>
            </div>
          </div>
          
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <ProgressBar
              label="❤️ Health"
              value={stats.hp}
              max={stats.maxHealth}
              color="#F74E52"
              textColor={currentTheme.subtext}
            />
            <ProgressBar
              label="⭐ Experience"
              value={stats.exp}
              max={stats.toNextLevel}
              color="#FFB445"
              textColor={currentTheme.subtext}
            />
            <ProgressBar
              label="💎 Mana"
              value={stats.mp}
              max={stats.maxMP}
              color="#50B5E9"
              textColor={currentTheme.subtext}
            />
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
        headers: {
          'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache for 30 minutes  
          'Content-Type': 'image/png',
          'X-Content-Type-Options': 'nosniff',
          'Cross-Origin-Resource-Policy': 'cross-origin',
        },
      },
    );
  } catch (error) {
    console.error("Error generating image:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2D1B47",
            fontFamily: "monospace",
            color: "#F74E52",
          }}
        >
          <h2 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
            Unexpected Error
          </h2>
          <p style={{ fontSize: "14px", textAlign: "center", margin: "0", maxWidth: "80%" }}>
            {errorMessage}
          </p>
        </div>
      ),
      {
        width: 600,
        height: 400,
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'Content-Type': 'image/png',
        },
      }
    );
  }
}

function ProgressBar({
  label,
  value,
  max,
  color,
  textColor,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  textColor: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: textColor,
          fontSize: "14px",
          marginBottom: "5px",
        }}
      >
        <span>{label}</span>
        <span>
          {Math.floor(value)} / {max}
        </span>
      </div>
      <div
        style={{
          height: "20px",
          backgroundColor: "#4D3B67",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(100, percentage)}%`,
            height: "100%",
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
