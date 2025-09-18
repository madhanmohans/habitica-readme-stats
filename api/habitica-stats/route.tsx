import { ImageResponse } from "@vercel/og";
import { getHabiticaStats } from "@/app/actions/habitica";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const stats = await getHabiticaStats();

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
              <h2 style={{ color: "white", fontSize: "24px", margin: "0" }}>
                @{stats.class.toLowerCase()}
              </h2>
              <p
                style={{
                  color: "#D3D3D3",
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
            />
            <ProgressBar
              label="⭐ Experience"
              value={stats.exp}
              max={stats.toNextLevel}
              color="#FFB445"
            />
            <ProgressBar
              label="💎 Mana"
              value={stats.mp}
              max={stats.maxMP}
              color="#50B5E9"
            />
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      },
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(
      `Error generating image: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}

function ProgressBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const percentage = (value / max) * 100;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#D3D3D3",
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
