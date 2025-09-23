import { ImageResponse } from "@vercel/og";
import { getHabiticaStatsWithCredentials } from "@/app/actions/habitica";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    console.log('API endpoint called with URL:', request.url);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const apiToken = searchParams.get('apiToken');
    const theme = searchParams.get('theme') || 'default';
    
    console.log('Parameters received:', { 
      userId: userId ? 'provided' : 'missing', 
      apiToken: apiToken ? 'provided' : 'missing',
      theme 
    });
    
    if (!userId || !apiToken) {
      const missingParams = [];
      if (!userId) missingParams.push('userId');
      if (!apiToken) missingParams.push('apiToken');
      
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
              color: "white",
              padding: "20px",
            }}
          >
            <h2 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
              Missing Parameters
            </h2>
            <p style={{ fontSize: "16px", textAlign: "center", margin: "0 0 10px 0" }}>
              Missing: {missingParams.join(', ')}
            </p>
            <p style={{ fontSize: "12px", textAlign: "center", margin: "0", color: "#D3D3D3" }}>
              URL: {request.url}
            </p>
          </div>
        ),
        {
          width: 600,
          height: 400,
        }
      );
    }

    console.log('Fetching Habitica stats...');
    const stats = await getHabiticaStatsWithCredentials(userId, apiToken);
    console.log('Stats fetched successfully:', { 
      class: stats.class, 
      level: stats.lvl, 
      hp: stats.hp, 
      maxHealth: stats.maxHealth 
    });

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

    const response = new ImageResponse(
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
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <img
              src="https://img.utdstc.com/icon/e99/6e9/e996e9fc7515afb60de11013c71209a2f12cf50d7ca67d88fb5fa280cf2f83c2:200"
              alt="Habitica Icon"
              width="100"
              height="100"
              style={{ marginRight: "20px" }}
            />
            <div>
              <h2 style={{ color: currentTheme.text, fontSize: "24px", margin: "0" }}>
                @{stats.class.toLowerCase()}
              </h2>
              <p
                style={{
                  color: currentTheme.subtext,
                  fontSize: "18px",
                  margin: "5px 0 0 0",
                }}
              >
                Level {stats.lvl} {stats.class}
              </p>
            </div>
          </div>
          <div style={{ width: "80%", maxWidth: "400px" }}>
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
        },
      },
    );

    return response;
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
            Error
          </h2>
          <p style={{ fontSize: "14px", textAlign: "center", margin: "0", maxWidth: "80%" }}>
            {errorMessage}
          </p>
        </div>
      ),
      {
        width: 600,
        height: 400,
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
            transition: "width 0.3s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}
