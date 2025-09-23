import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
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
        }}
      >
        <h1 style={{ fontSize: "32px", margin: "0 0 20px 0" }}>
          🎮 Test Image
        </h1>
        <p style={{ fontSize: "18px", textAlign: "center", margin: "0" }}>
          If you can see this, image generation is working!
        </p>
        <p style={{ fontSize: "14px", textAlign: "center", margin: "10px 0 0 0", color: "#D3D3D3" }}>
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
