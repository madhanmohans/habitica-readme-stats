import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

const HABITICA_API_URL = "https://habitica.com/api/v3";

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

async function getHabiticaStatsWithCredentials(
  userId: string,
  apiToken: string
): Promise<HabiticaStats> {
  try {
    console.log("Making request to Habitica API...");
    const response = await fetch(`${HABITICA_API_URL}/user`, {
      headers: {
        "x-client": "habitica-readme-stats-1.0.0",
        "x-api-user": userId,
        "x-api-key": apiToken,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Habitica API returned ${response.status}: ${response.statusText}. ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Raw API response structure:", {
      hasData: !!data.data,
      hasStats: !!data.data?.stats,
      dataKeys: data.data ? Object.keys(data.data) : [],
      statsKeys: data.data?.stats ? Object.keys(data.data.stats) : []
    });

    if (!data.data || !data.data.stats) {
      throw new Error("Invalid response structure from Habitica API");
    }

    const stats = data.data.stats;

    // Validate required fields
    const requiredFields = ['hp', 'maxHealth', 'mp', 'maxMP', 'exp', 'toNextLevel', 'lvl', 'class'];
    const missingFields = requiredFields.filter(field => stats[field] === undefined);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields from Habitica API: ${missingFields.join(', ')}`);
    }

    const result = {
      hp: Number(stats.hp) || 0,
      maxHealth: Number(stats.maxHealth) || 50,
      mp: Number(stats.mp) || 0,
      maxMP: Number(stats.maxMP) || 0,
      exp: Number(stats.exp) || 0,
      toNextLevel: Number(stats.toNextLevel) || 100,
      lvl: Number(stats.lvl) || 1,
      gp: Math.floor(Number(stats.gp) || 0),
      class: String(stats.class || 'warrior'),
    };

    console.log("Processed stats:", result);
    return result;
  } catch (error) {
    console.error("Error in getHabiticaStatsWithCredentials:", error);
    throw error;
  }
}

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    console.log('API endpoint called with URL:', request.url);
    
    // For debugging - return a simple image first
    const { searchParams } = new URL(request.url);
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
            Simple Debug Image Works! 🎉
          </div>
        ),
        {
          width: 600,
          height: 400,
        }
      );
    }

    // Test with mock data instead of API call
    if (debug === 'mock') {
      const mockStats = {
        hp: 45,
        maxHealth: 50,
        mp: 32,
        maxMP: 40,
        exp: 180,
        toNextLevel: 250,
        lvl: 15,
        gp: 125,
        class: 'mage',
      };

      const themes = {
        default: { background: "#2D1B47", text: "white", subtext: "#D3D3D3" },
        dark: { background: "#0f0f23", text: "#cccccc", subtext: "#999999" },
        light: { background: "#ffffff", text: "#24292e", subtext: "#586069" },
      };
      
      const theme = searchParams.get('theme') || 'default';
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
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2 style={{ color: currentTheme.text, fontSize: "24px", margin: "0" }}>
                  @{mockStats.class.toLowerCase()} (MOCK DATA)
                </h2>
                <p
                  style={{
                    color: currentTheme.subtext,
                    fontSize: "18px",
                    margin: "5px 0 0 0",
                  }}
                >
                  Level {mockStats.lvl} {mockStats.class}
                </p>
              </div>
            </div>
            <div style={{ width: "80%", maxWidth: "400px" }}>
              <MockProgressBar
                label="❤️ Health"
                value={mockStats.hp}
                max={mockStats.maxHealth}
                color="#F74E52"
                textColor={currentTheme.subtext}
              />
              <MockProgressBar
                label="⭐ Experience"
                value={mockStats.exp}
                max={mockStats.toNextLevel}
                color="#FFB445"
                textColor={currentTheme.subtext}
              />
              <MockProgressBar
                label="💎 Mana"
                value={mockStats.mp}
                max={mockStats.maxMP}
                color="#50B5E9"
                textColor={currentTheme.subtext}
              />
            </div>
          </div>
        ),
        {
          width: 600,
          height: 400,
        }
      );
    }
    
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
    let stats;
    try {
      // Add a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('API call timed out after 10 seconds')), 10000)
      );
      
      stats = await Promise.race([
        getHabiticaStatsWithCredentials(userId, apiToken),
        timeoutPromise
      ]) as HabiticaStats;
      
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
              Habitica API Error
            </h2>
            <p style={{ fontSize: "14px", textAlign: "center", margin: "0", maxWidth: "80%" }}>
              {apiError instanceof Error ? apiError.message : "Failed to fetch Habitica data"}
            </p>
            <p style={{ fontSize: "12px", textAlign: "center", margin: "10px 0 0 0", color: "#999" }}>
              Check your userId and apiToken
            </p>
          </div>
        ),
        {
          width: 600,
          height: 400,
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

function MockProgressBar({
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
