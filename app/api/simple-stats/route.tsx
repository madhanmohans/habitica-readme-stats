import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Very simple approach - just return a hardcoded stats image for now
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
              <h1 style={{ fontSize: "28px", margin: "0", color: "white" }}>
                @habitica-user
              </h1>
              <p style={{ fontSize: "18px", margin: "5px 0 0 0", color: "#D3D3D3" }}>
                Level 15 Mage
              </p>
            </div>
          </div>
          
          <div style={{ width: "100%", maxWidth: "400px" }}>
            {/* Health Bar */}
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
                <span>❤️ Health</span>
                <span>45 / 50</span>
              </div>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#4D3B67",
                  borderRadius: "10px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "90%",
                    height: "100%",
                    backgroundColor: "#F74E52",
                  }}
                />
              </div>
            </div>

            {/* Experience Bar */}
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
                <span>⭐ Experience</span>
                <span>180 / 250</span>
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
                    width: "72%",
                    height: "100%",
                    backgroundColor: "#FFB445",
                  }}
                />
              </div>
            </div>

            {/* Mana Bar */}
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
                <span>💎 Mana</span>
                <span>32 / 40</span>
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
                    width: "80%",
                    height: "100%",
                    backgroundColor: "#50B5E9",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      }
    );
  } catch (error) {
    return new Response("Error generating image", { status: 500 });
  }
}
